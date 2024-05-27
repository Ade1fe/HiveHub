import { Box, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, useDisclosure, Divider, Flex, useBreakpointValue } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { HiOutlineVideoCamera } from "react-icons/hi";
import { HiOutlineCodeBracket } from "react-icons/hi2";
import { MdFormatBold, MdFormatListNumbered } from "react-icons/md";
import { AiTwotoneCode } from "react-icons/ai";
import { BsTypeItalic, BsBlockquoteLeft } from "react-icons/bs";
import { PiTextTThin, PiListBulletsBold, PiCodeBlockFill } from "react-icons/pi";
import { CiUndo, CiRedo } from "react-icons/ci";
import { PiBracketsCurly } from "react-icons/pi";
import { auth, firestore, storage } from "../../firebase";
import { addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { User } from "firebase/auth";
// @ts-ignore
import { useCurrentEditor } from '@tiptap/react'
// @ts-ignore
import TextEditor from "../../components/editor/TextEditor";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";


const Write = () => {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    const [content, setContent] = useState('');
    const [authorId, setAuthorId] = useState('');
    const [authorUsername, setAuthorUsername] = useState('');
    const [authorImage, setAuthorImage] = useState('');
    const [mediaUrls, setMediaUrls] = useState<string[]>([]);
    // @ts-ignore
    const [defaultFontSize, setDefaultFontSize] = useState<number>(20);
    const [currentFontSize, setCurrentFontSize] = useState<number>(defaultFontSize);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const [activeButton, setActiveButton] = useState<number | null>(null);

    const initialFontSize = useBreakpointValue({ base: 16, lg: 24 });


    useEffect(() => {
        const author = auth.onAuthStateChanged(async (user: User | null) => {
            setCurrentUser(user);
            if (user) {
                setAuthorId(user.uid);
                const userDocRef = doc(firestore, 'Reader', user.uid);
                const userDoc = await getDoc(userDocRef);
                if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setAuthorUsername(userData.username);
                    setAuthorImage(userData.userImage);
                }
                else {
                    console.log('No such reader in database');
                }
            }
            else {
                console.log('No user is signed in');
            }
        });

        return () => author();
    }, []);





    useEffect(() => {
        if (initialFontSize) {
            setCurrentFontSize(initialFontSize);
        }
    }, [initialFontSize]);





    const handleContentChange = () => {
        const contentEditable = contentEditableRef.current;
        if (contentEditable) {
            // contentEditable.style.fontSize = `${currentFontSize}px`;
            setContent(contentEditable.innerHTML);
            if (contentEditable.innerHTML.trim() === '') {
                contentEditable.innerHTML = '<p class="placeholder">Your content</p>';
                contentEditable.style.color = 'gray.400';
            }
        }
    };





    const changeFontSize = (increment: number, buttonNumber: number) => {
        let newSize = currentFontSize;
        if (activeButton === buttonNumber) {
            newSize = defaultFontSize; // reset to default if the same button is clicked again
            setActiveButton(null); // reset the active button
        } else {
            newSize += increment;
            setActiveButton(buttonNumber); // set the active button
        }
        const contentEditable = contentEditableRef.current;

        if (contentEditable) {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                const selectedContent = range.extractContents();
                const span = document.createElement('span');
                span.style.fontSize = `${newSize}px`;
                span.appendChild(selectedContent);
                range.insertNode(span);
                handleContentChange();
            }
        }
        setCurrentFontSize(newSize);
    };

    // const toggleFontSize = (increment: number) => {
    //     if (activeButton === increment) {
    //         setActiveButton(null);
    //     } else {
    //         setActiveButton(increment);
    //     }
    // };

    // const increaseFontSizeBy4 = () => {
    //     toggleFontSize(4);
    //     changeFontSize(4);
    // };

    // const increaseFontSizeBy2 = () => {
    //     toggleFontSize(2);
    //     changeFontSize(2);
    // };





    const insertText = (value: string = '', command: string) => {
        const contentEditable = contentEditableRef.current;
        if (contentEditable) {
            const selection = window.getSelection();
            const selectedText = selection?.toString();
            
            if (selectedText) {
                // There is selected text
                console.log("Selected text:", selectedText);
            } else {
                // No text selected
                console.log("No text selected");
            }
            if (command === 'codeBlock') {
                const codeBlock = `<pre><code>${selectedText}</code></pre>`;
                insertAtCursor(codeBlock);
            } else if (command === 'blockquote') {
                const blockquote = `<blockquote>${selectedText}</blockquote>`;
                insertAtCursor(blockquote);
            } else {
                document.execCommand(command, false, value);
                handleContentChange();
            }
        }
    };





    const insertAtCursor = (html: string) => {
        const contentEditable = contentEditableRef.current;
        if (!contentEditable) return;

        contentEditable.focus();
        const sel = window.getSelection();
        if (sel && sel.rangeCount > 0) {
            const range = sel.getRangeAt(0);
            range.deleteContents();

            const tempDev = document.createElement('div');
            tempDev.innerHTML = html;
            const frag = document.createDocumentFragment();
            let node, lastNode;
            while ((node = tempDev.firstChild)) {
                lastNode = frag.appendChild(node);
            }
            range.insertNode(frag);

            if (lastNode) {
                range.setEndAfter(lastNode);
                range.collapse(true);
                sel.removeAllRanges();
                sel.addRange(range);
            }
        }

        handleContentChange();
    };





    const handleFileUpload = async (type: string) => {
        const input = document.createElement("input");
        input.type = 'file';
        input.accept = type === 'image' ? 'image/*' : 'video/*';
        input.onchange = async (event: any) => {
            const files = event.target.files;
            if (files.length > 0) {
                const urls: string[] = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const fileRef = ref(storage, `uploads/${Date.now()}-${file.name}`);
                    await uploadBytes(fileRef, file);
                    const url = await getDownloadURL(fileRef);
                    urls.push(url);
                    const mediaElement = type === 'image'
                        ? `\n\n<img src="${url}" alt="uploaded image" style="max-width: 100%; display: block; margin: 10px 0;" />\n\n`
                        : `\n\n<video src="${url}" controls style="max-width: 100%; display: block; margin: 10px 0;"></video>\n\n`;
                    insertAtCursor(mediaElement);
                }
                setMediaUrls(prevUrls => [...prevUrls, ...urls]);
            }
        };
        input.click();
    }

    

    const addCodeBlock = () => {
        const codeBlock = `\n<pre><code>// New code block\n</code></pre>\n`;
        insertAtCursor(codeBlock);
    }

    const addEmbeddedCode = () => {
        const embeddedCode = `\n<iframe src="https://example.com"></iframe>\n`;
        insertText(embeddedCode, 'inserHTML');
    }





    useEffect(() => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML.trim() === '') {
            contentEditableRef.current.innerHTML = '<p class="placeholder">Your content</p>';
        }
    }, []);

    const handleBlur = () => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML.trim() === '') {
            contentEditableRef.current.innerHTML = '<p class="placeholder">Your content</p>';
        }
    };


    const handleFocus = () => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML === '<p class="placeholder">Your content</p>') {
            contentEditableRef.current.innerHTML = '';
        }
    };





    const savePost = async () => {
        if (!currentUser) {
            console.log('User is not authenticated');
            return;
        }
        try {
            // const serializedContent = editorRef.current;
            const contentEditable = contentEditableRef.current;
            if (contentEditable) {
                const serializedContent = contentEditable.innerHTML;
                const docRef = collection(firestore, 'datainformation');
                await addDoc(docRef, {
                    title: title,
                    content: serializedContent,
                    category: topic,
                    timestamp: serverTimestamp(),
                    authorId: authorId,
                    username: authorUsername,
                    authorImage: authorImage,
                    contentImage: mediaUrls,
                });
                console.log('Post saved successfully');
                setTitle('');
                setTopic('');
                setContent('');
                setMediaUrls([]);
            }
            else {
                console.error('contentEditableRef is not initialized');
            }
        }
        catch (err) {
            console.log('Error saving post', err);
        }
    };

    
    const handleContinue = () => {
        if (title.trim() !== '' && content.trim() !== '') {
            onOpen();
        }
        else {
            console.log('Title or content is empty')
        }
    }


    const handleSave = (e: any) => {
        e.preventDefault();
        if (!currentUser) {
            console.log('User is not authenticated');
            return;
        }
        if (topic.trim() !== '') {
            savePost();
            onClose();
        }
        else {
            console.log('Topic is empty');
        }
    }
      

    
  return (
    <Box display='flex' flexDir='column' w='100%' alignItems='center' justifyContent='center' gap={['20px', '10px']} px={[4,4,4,4,2,0]} py='30px' maxW={['90%', "65%"]} mx='auto'>
        <Input type='text' value={title} onChange={(e) => setTitle(e.target.value)} variant='unstyled' focusBorderColor='white' placeholder='Title' _placeholder={{ opacity: 1, color: 'gray.400', fontSize: ['25px', '40px'] }} fontSize={['25px', '40px']} size='lg' alignItems='center' justifyContent='center' display='flex' py='10px' px='10px' />
        <Box width='100%' pos='relative' display='flex' flexDir='column'>
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<MdAdd />}
                    variant='outline'
                    borderRadius='50%'
                    fontSize='25px'
                    fontWeight='400'
                    transition='all 0.2s'
                    borderWidth='1px'
                    _focus={{ boxShadow: 'flushed' }}
                    pos='absolute'
                    ml={['-11%', '-7%']}
                />
                <MenuList display='flex' alignItems='center' justifyContent='space-between' px='7px' py='5px' border='none' shadow='none'>
                    <MenuItem w='30px' h='30px' border='gray.300' borderWidth='1px' borderRadius='50%' color='blue.500' display='flex' background='none' alignItems='center' justifyContent='center' _hover={{ background: 'none', cursor: 'pointer' }} p='3px' fontSize='x-large' onClick={() => handleFileUpload('image')}><CiImageOn /></MenuItem >
                    <MenuItem w='30px' h='30px' border='gray.300' borderWidth='1px' borderRadius='50%' color='blue.500' display='flex' background='none' alignItems='center' justifyContent='center' _hover={{ background: 'none', cursor: 'pointer' }} p='3px' fontSize='x-large' onClick={() => handleFileUpload('video')}><HiOutlineVideoCamera /></MenuItem >
                    <MenuItem w='30px' h='30px' border='gray.300' borderWidth='1px' borderRadius='50%' color='blue.500' display='flex' background='none' alignItems='center' justifyContent='center' _hover={{ background: 'none', cursor: 'pointer' }} p='3px' fontSize='x-large' onClick={addCodeBlock}><HiOutlineCodeBracket /></MenuItem >
                    <MenuItem w='30px' h='30px' border='gray.300' borderWidth='1px' borderRadius='50%' color='blue.500' display='flex' background='none' alignItems='center' justifyContent='center' _hover={{ background: 'none', cursor: 'pointer' }} p='3px' fontSize='x-large' onClick={addEmbeddedCode}><PiBracketsCurly /></MenuItem >
                </MenuList>
            </Menu>

            <Box>
                <Box display='flex' px='6px' py='6px' gap='10px' h='50px' >
                    <Button p='4px' background='white' fontSize='20px' onClick={() => insertText('insertHTML', 'bold')}>
                        <MdFormatBold fontWeight='500'/>
                    </Button>
                    <Button p='4px' background='white' fontSize='18px' onClick={() => insertText('insertHTML', 'italic')}>
                        <BsTypeItalic fontWeight='500'/>
                    </Button>
                    <Divider orientation='vertical' />
                    <Button p='4px' background='white' fontSize='22px' onClick={() => changeFontSize(4, 1)}>
                        <PiTextTThin fontWeight='800' color={activeButton === 1 ? 'green' : 'gray'} />
                    </Button>
                    <Button p='4px' background='white' fontSize='18px' onClick={() => changeFontSize(2, 2)}>
                        <PiTextTThin fontWeight='500' color={activeButton === 2 ? 'green' : 'gray'} />
                    </Button>
                    <Flex w='10px' />
                    <Button p='4px' background='white' fontSize='18px' onClick={() => insertText('', 'codeBlock')}>
                        <AiTwotoneCode fontWeight='500'/>
                    </Button>
                    {/* <Button p='4px' background='white' fontSize='18px' onClick={() => insertText('', 'codeBlock')}>
                        <PiCodeBlockFill fontWeight='500'/>
                    </Button> */}
                    <Button p='4px' background='white' fontSize='18px' onClick={() => insertText('', 'blockquote')}>
                        <BsBlockquoteLeft fontWeight='500'/>
                    </Button>
                    <Flex w='15px' />
                    <Button p='4px' background='white' fontSize='18px' onClick={() => insertText('insertHTML', 'undo')}>
                        <CiUndo fontWeight='500'/>
                    </Button>
                    <Button p='4px' background='white' fontSize='18px' onClick={() => insertText('insertHTML', 'redo')}>
                        <CiRedo fontWeight='500'/>
                    </Button>
                </Box>
                <Box contentEditable='true' className="scroll" onInput={handleContentChange} onFocus={handleFocus} onBlur={handleBlur} ref={contentEditableRef} resize='none' px='10px' py='10px' color='gray.600' _placeholder={{ opacity: 1, color: 'gray.400', fontSize: ['16px', '24px'] }} fontSize={['16px', '24px']} style={{ minHeight: '50px', color: 'gray.800', overflowY: 'auto', fontSize: `${currentFontSize}px` }} border='none' _focus={{ border: 'none~' }} ></Box>
            </Box>
            <Button onClick={handleContinue} mt='20px' colorScheme='blue' ml='auto' borderRadius='1000px'>Continue</Button>
        </Box>
        <Modal isCentered isOpen={isOpen} onClose={onClose} size={['xs', 'md', 'lg']} >
            <ModalOverlay background='white' backdropFilter='blur(50px) hue-rotate(90deg)' />
            <ModalContent>
                <ModalHeader mt='20px' fontWeight='500'>Content preview</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <FormControl gap='10px'>
                        <FormLabel color='gray.500' fontWeight='400'>Add or change topics (up to 5) so readers know what your story is about</FormLabel>
                        <Input value={topic} onChange={(e) => setTopic(e.target.value)} variant='flushed' size='lg' placeholder='Add a topic' focusBorderColor='whiteAlpha' _hover={{ outline: 'none', border: 'none' }} _focus={{ outline: 'none', background: 'transparent' }} autoComplete="one-time-code" />
                    </FormControl>
                </ModalBody>

                <ModalFooter>
                    <Button colorScheme='blue' borderRadius='1000px' mr={3} onClick={handleSave} >
                        Publish
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    </Box>
  )
}

export default Write