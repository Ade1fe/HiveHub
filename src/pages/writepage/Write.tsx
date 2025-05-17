import { Box, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, useDisclosure, Divider, Flex, useBreakpointValue } from "@chakra-ui/react"
import { useEffect, useRef, useState } from "react";
import { MdAdd } from "react-icons/md";
import { CiImageOn } from "react-icons/ci";
import { MdFormatBold } from "react-icons/md";
import { AiTwotoneCode } from "react-icons/ai";
import { BsTypeItalic, BsBlockquoteLeft } from "react-icons/bs";
import { PiTextTThin, PiVideo } from "react-icons/pi";
import { CiUndo, CiRedo } from "react-icons/ci";
import { IoIosColorPalette } from "react-icons/io";
import { auth, firestore, storage } from "../../firebase";
import { addDoc, doc, getDoc, serverTimestamp } from 'firebase/firestore';
import { collection } from 'firebase/firestore';
import { User } from "firebase/auth";
// @ts-ignore
import { useCurrentEditor } from '@tiptap/react'
// @ts-ignore
import TextEditor from "../../components/editor/TextEditor";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CirclePicker } from "react-color";
import { toast } from "sonner";
import Toast from "../../toast/Toast";


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
    const [activeButton, setActiveButton] = useState<number | null>(null);
    const [color, setColor] = useState('#000');
    const [showColorPicker, setShowColorPicker] = useState(false);

    // Refs and hooks
    const contentEditableRef = useRef<HTMLDivElement>(null);
    const savedRange = useRef<Range | null>(null);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const initialFontSize = useBreakpointValue({ base: 16, md: 18, lg: 24 });
    

    useEffect(() => {
      if (initialFontSize) {
        setCurrentFontSize(initialFontSize);
      }
    }, [initialFontSize]);


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
            }
        });

        return () => author();
    }, []);


    const handleContentChange = () => {
      const contentEditable = contentEditableRef.current;
      if (contentEditable) {
        setContent(contentEditable.innerHTML);
        contentEditable.style.height = 'auto';
        contentEditable.style.height = `${contentEditable.scrollHeight}px`;

        if (contentEditable.innerHTML.trim() === '') {
          contentEditable.innerHTML = '<p class="placeholder">Your content</p>';
          contentEditable.style.color = 'gray.400';
        }
      }
    };


    const changeFontSize = (increment: number, buttonNumber: number) => {
        // let newSize = currentFontSize;
        // if (activeButton === buttonNumber) {
        //     newSize = defaultFontSize; // reset to default if the same button is clicked again
        //     setActiveButton(null); // reset the active button
        // } else {
        //     newSize += increment;
        //     setActiveButton(buttonNumber); // set the active button
        // }

        const newSize = activeButton === buttonNumber ? initialFontSize || 16 : (initialFontSize || 16) + increment;
        setCurrentFontSize(newSize);
        setActiveButton(activeButton === buttonNumber ? null : buttonNumber);

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





    // const insertText = (command: string, value: string = '') => {
    //     const contentEditable = contentEditableRef.current;
    //     if (contentEditable) {
    //         const selection = window.getSelection();
    //         const selectedText = selection?.toString();
            
    //         // if (selectedText) {
    //         //     console.log("Selected text:", selectedText);
    //         // } else {
    //         //     console.log("No text selected");
    //         // }
    //         if (command === 'codeBlock') {
    //             const codeBlock = `<pre><code>${selectedText}</code></pre>`;
    //             insertAtCursor(codeBlock);
    //         } else if (command === 'blockquote') {
    //             const blockquote = `<blockquote>${selectedText}</blockquote>`;
    //             insertAtCursor(blockquote);
    //         } else if (command === 'foreColor') {
    //             document.execCommand('foreColor', false, color);
    //             handleContentChange();
    //         } else {
    //             document.execCommand(command, false, value);
    //             handleContentChange();
    //         }
    //     }
    // };


    const insertText = (command: string, value: string = '') => {
      const contentEditable = contentEditableRef.current;
      if (!contentEditable) return;

      contentEditable.focus();
      const selection = window.getSelection();
      const selectedText = selection?.toString();

      if (command === 'foreColor') {
        document.execCommand('foreColor', false, color);
      } else if (command === 'codeBlock') {
        insertAtCursor(`<pre><code>${selectedText}</code></pre>`);
      } else if (command === 'blockquote') {
        insertAtCursor(`<blockquote>${selectedText}</blockquote>`);
      } else {
        document.execCommand(command, false, value);
      }
      handleContentChange();
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
                        ? `\n\n<img src="${url}" alt="uploaded image" style="max-width: 100%; display: block; margin: 10px 0;" />\n\n\n`
                        : `\n\n<video src="${url}" controls style="max-width: 100%; display: block; margin: 10px 0;"></video>\n\n\n`;
                    insertAtCursor(mediaElement);
                }
                setMediaUrls(prevUrls => [...prevUrls, ...urls]);
            }
        };
        input.click();
    }


    const savePost = async () => {
        if (!currentUser) {
            showToastMessage('Reader is not authenticated', 'warning');
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
                setTitle('');
                setTopic('');
                setContent('');
                setMediaUrls([]);
                if (contentEditableRef.current) {
                  contentEditableRef.current.innerHTML = '<p class="placeholder">Your content</p>';
                }
                showToastMessage('Post published successfully', 'success')
            }
        }
        catch (err) {
            console.log('Error saving post', err);
            showToastMessage(err, 'error')
        }
    };


    const handleColorChange = (color: any) => {
        setColor(color.hex);
        setShowColorPicker(false);

        // Restore selection and apply color
        if (savedRange.current) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(savedRange.current);
            document.execCommand('foreColor', false, color.hex);
            handleContentChange();
        }
    };

    const toggleColorPicker = () => {
        // Save the current selection
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            savedRange.current = selection.getRangeAt(0);
        }
        setShowColorPicker(!showColorPicker);
    };


    //   CONFIGURING TOAST TO TOAST MESSAGE
    const showToastMessage = (message: any, type: 'success' | 'error' | 'warning') => {
        switch (type) {
            case 'success':
                toast.success(message, {
                    position: 'top-right',
                    duration: 3000,
                });
                break;
            case 'error':
                toast.error(message, {
                    position: 'top-right',
                    duration: 3000,
                });
                break;
            case 'warning':
                toast.warning(message, {
                    position: 'top-right',
                    duration: 3000,
                });
                break;
            default:
                break;
        }
    };


    const handleContinue = () => {
        if (title.trim() !== '' && content.trim() !== '') {
            onOpen();
        }
        else {
            showToastMessage('Please fill the title or post content', 'warning');
        }
    }


    const handleSave = (e: any) => {
        e.preventDefault();
        if (topic.trim() !== '') {
          showToastMessage('Please fill the post Topic', 'warning');
          return;
        }
        savePost();
        onClose();
    }    


    const handleFocus = () => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML === '<p class="placeholder">Your content</p>') {
            contentEditableRef.current.innerHTML = '';
        }
    };


    const handleBlur = () => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML.trim() === '') {
            contentEditableRef.current.innerHTML = '<p class="placeholder">Your content</p>';
        }
    };


    useEffect(() => {
        if (contentEditableRef.current && contentEditableRef.current.innerHTML.trim() === '') {
            contentEditableRef.current.innerHTML = '<p class="placeholder">Your content</p>';
        }
    }, []);

      

    
  return (
    <Box display='flex' flexDir='column' w='100%' alignItems='center' justifyContent='center' gap={['20px', '10px']} px={[0, 4, 6]} py={[4, 6, 8]} maxW={['95%', '90%', "65%"]} mx='auto'>
        <Input type='text' value={title} onChange={(e) => setTitle(e.target.value)} variant='unstyled' focusBorderColor='white' placeholder='Title' _placeholder={{ opacity: 1, color: 'gray.400', fontSize: ['xl', '2xl', '3xl'] }} fontSize={['xl', '2xl', '3xl']} size='lg' alignItems='center' justifyContent='center' display='flex' py={2} px={4} />
        {/* <Flex align="center" mb={2} wrap="nowrap" gap={1} width='100%' pos='relative' display='flex' >
            <Menu>
                <MenuButton
                    as={IconButton}
                    aria-label='Options'
                    icon={<MdAdd />}
                    variant='outline'
                    borderRadius='50%'
                    size="sm"
                    fontSize='25px'
                    fontWeight='400'
                    transition='all 0.2s'
                    borderWidth='1px'
                    _focus={{ boxShadow: 'flushed' }}
                />
                <MenuList shadow='sm' w='auto'>
                    <MenuItem w='30px' h='30px' border='gray.300' borderWidth='1px' borderRadius='50%' color='blue.500' display='flex' background='none' alignItems='center' justifyContent='center' _hover={{ background: 'none', cursor: 'pointer' }} p='3px' fontSize='x-large' onClick={() => handleFileUpload('image')}><CiImageOn /></MenuItem >
                    <MenuItem w='30px' h='30px' border='gray.300' borderWidth='1px' borderRadius='50%' color='blue.500' display='flex' background='none' alignItems='center' justifyContent='center' _hover={{ background: 'none', cursor: 'pointer' }} p='3px' fontSize='x-large' onClick={() => handleFileUpload('video')}><HiOutlineVideoCamera /></MenuItem >
                </MenuList>
            </Menu>

            <Box>
                <Box display='flex' px='6px' py='6px' h='50px' >
                    <IconButton aria-label="Bold" icon={<MdFormatBold />} size="md" onClick={() => insertText('bold')} />
                    <IconButton aria-label="Italic" icon={<BsTypeItalic />} size="md" onClick={() => insertText('italic')} />
                    <Divider orientation="vertical" h="24px" />
                    <IconButton aria-label="Increase font" icon={<PiTextTThin />} size="md" onClick={() => changeFontSize(4, 1)} color={activeButton === 1 ? 'green.500' : 'gray.500'} />
                    <IconButton aria-label="Decrease font" icon={<PiTextTThin />} size="md" onClick={() => changeFontSize(-2, 2)} color={activeButton === 2 ? 'green.500' : 'gray.500'} />
                    <IconButton aria-label="Code block" icon={<AiTwotoneCode />} size="md" onClick={() => insertText('codeBlock')} />
                    <IconButton aria-label="Text color" icon={<IoIosColorPalette />} size="md" onClick={toggleColorPicker} />
                    <IconButton aria-label="Blockquote" icon={<BsBlockquoteLeft />} size="md" onClick={() => insertText('blockquote')} />
                    <IconButton aria-label="Undo" icon={<CiUndo />} size="md" onClick={() => insertText('undo')} />
                    <IconButton aria-label="Redo" icon={<CiRedo />} size="md" onClick={() => insertText('redo')} />
                </Box>
                <Box contentEditable='true' className="scroll" onInput={handleContentChange} onFocus={handleFocus} onBlur={handleBlur} ref={contentEditableRef} resize='none' px='10px' py='10px' color='gray.600' _placeholder={{ opacity: 1, color: 'gray.400', fontSize: ['16px', '24px'] }} fontSize={['16px', '24px']} style={{ minHeight: '50px', color: 'gray.800', overflowY: 'auto', fontSize: `${currentFontSize}px` }} border='none' _focus={{ border: 'none~' }} ></Box>
            </Box>
            <Button onClick={handleContinue} mt='20px' colorScheme='blue' ml='auto' borderRadius='1000px'>Continue</Button>
        </Flex>
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
        </Modal> */}

        <Flex align="center" mb={2} wrap="wrap" gap={[2.5]} width='100%' alignItems='start' justifyContent={['start', 'space-between']}>
            <Menu>
              <MenuButton
                as={IconButton}
                aria-label='Add media'
                icon={<MdAdd />}
                variant='outline'
                transition='all 0.2s'
                borderWidth='1px'
                _focus={{ boxShadow: 'flushed' }}
              />
              <MenuList w='2rem' py={1} px={1}>
                <MenuItem icon={<CiImageOn size='1.5rem' />} onClick={() => handleFileUpload('image')}>
                  Add Image
                </MenuItem>
                <MenuItem icon={<PiVideo size='1.5rem' />} onClick={() => handleFileUpload('video')}>
                  Add Video
                </MenuItem>
              </MenuList>
            </Menu>

            <Flex display='flex' justifyContent='center' py='4px' gap={[1.5, 2]}>
              <IconButton aria-label="Bold" icon={<MdFormatBold />} size={['base']} w={['2.063rem', '2.5rem']} onClick={() => insertText('bold')} />
              <IconButton aria-label="Italic" icon={<BsTypeItalic />} size={['base']} w={['2.063rem', '2.5rem']} onClick={() => insertText('italic')} />
              <Divider orientation="vertical" h={['30px', "39px"]} />
              <IconButton aria-label="Increase font" icon={<PiTextTThin />} size={['base']} w={['2.063rem', '2.5rem']} onClick={() => changeFontSize(4, 1)} color={activeButton === 1 ? 'green.500' : 'gray.500'} />
              <IconButton aria-label="Decrease font" icon={<PiTextTThin />} size={['base']} w={['2.063rem', '2.5rem']} onClick={() => changeFontSize(-2, 2)} color={activeButton === 2 ? 'green.500' : 'gray.500'} />
              <IconButton aria-label="Code block" icon={<AiTwotoneCode />} size={['base']} w={['2.063rem', '2.5rem']} onClick={() => insertText('codeBlock')} />
              <IconButton aria-label="Text color" icon={<IoIosColorPalette />} size={['base']} w={['2.063rem', '2.5rem']} onClick={toggleColorPicker} />
              <IconButton aria-label="Blockquote" icon={<BsBlockquoteLeft />} size={['base']} w={['2.063rem', '2.5rem']} onClick={() => insertText('blockquote')} />
              <IconButton aria-label="Undo" icon={<CiUndo />} size={['base']} w={['2.063rem', '2.5rem']} onClick={() => insertText('undo')} />
              <IconButton aria-label="Redo" icon={<CiRedo />} size={['base']} w={['2.063rem', '2.5rem']} onClick={() => insertText('redo')} />
            </Flex>
        </Flex>

          {/* Content Editable Area */}
        <Box ref={contentEditableRef} contentEditable onInput={handleContentChange} onFocus={handleFocus} onBlur={handleBlur} className="scroll" px={3} py={2} h='12.5rem' minH="12.5rem" w='100%' overflowY="auto" borderWidth="1px" borderRadius="md" borderColor="gray.200" fontSize={`${currentFontSize}px`} lineHeight="1.6" color='gray.600' _placeholder={{ opacity: 1, color: 'gray.400', fontSize: ['16px', '24px'] }} style={{ minHeight: '50px', color: 'gray.800', overflowY: 'auto', fontSize: `${currentFontSize}px` }} _focus={{ border: 'none~' }} />

          {showColorPicker && (
            <Box>
              <CirclePicker 
                color={color} 
                onChangeComplete={handleColorChange} 
              />
            </Box>
          )}

          <Button onClick={handleContinue} mt={6} ml="auto" colorScheme="blue" borderRadius="full" size="lg" >
            Continue
          </Button>

          {/* Publish Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size={['sm', 'md', 'lg']}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Content preview</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <FormControl>
                  <FormLabel>Add topic (up to 5)</FormLabel>
                  <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Add a topic" variant="flushed" size="lg" />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleSave} borderRadius="full" >
                  Publish
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

        {/* {showColorPicker && (
          <CirclePicker color={color} onChangeComplete={handleColorChange} />
        )} */}

        <Toast showToast={showToastMessage} />
    </Box>
  )
}

export default Write