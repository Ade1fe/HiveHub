import { Box, IconButton, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button, FormControl, FormLabel, useDisclosure, Divider, Flex, useBreakpointValue } from "@chakra-ui/react"
import { useCallback, useEffect, useRef, useState } from "react";
import { MdAdd, MdFormatBold } from "react-icons/md";
import { CiImageOn, CiUndo, CiRedo } from "react-icons/ci";
import { AiTwotoneCode } from "react-icons/ai";
import { BsTypeItalic, BsBlockquoteLeft } from "react-icons/bs";
import { PiTextTThin, PiVideo } from "react-icons/pi";
import { IoIosColorPalette } from "react-icons/io";
import { auth, firestore, storage } from "../../firebase";
import { addDoc, doc, getDoc, serverTimestamp, collection } from 'firebase/firestore';
import { User } from "firebase/auth";
// @ts-ignore
import { useCurrentEditor } from '@tiptap/react'
// @ts-ignore
import TextEditor from "../../components/editor/TextEditor";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { CirclePicker } from "react-color";
import { toast } from "sonner";
import Toast from "../../toast/Toast";

type ToastType = 'success' | 'error' | 'warning';

const Write = () => {
    const [title, setTitle] = useState('');
    const [topic, setTopic] = useState('');
    // @ts-ignore
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
    const initialFontSize = useBreakpointValue({ base: 16, md: 18, lg: 20 }) || 16;
    

    useEffect(() => {
      setCurrentFontSize(initialFontSize);
    }, [initialFontSize]);


    useEffect(() => {
        const author = auth.onAuthStateChanged(async (user: User | null) => {
            setCurrentUser(user);
            if (user) {
                setAuthorId(user.uid);
                try {
                  const userDocRef = doc(firestore, 'Reader', user.uid);
                  const userDoc = await getDoc(userDocRef);
                  if (userDoc.exists()) {
                    const userData = userDoc.data();
                    setAuthorUsername(userData.username || '');
                    setAuthorImage(userData.userImage || '');
                  }
                }
                catch (err) {
                  console.error("Error fetching user data:", err);
                }
            }
          });
          
          return () => author();
    }, []);
    

    useEffect(() => {
      if (contentEditableRef.current && contentEditableRef.current.innerHTML.trim() === '') {
        contentEditableRef.current.innerHTML = '<p class="placeholder">Your content</p>';
      }
    }, []);
    

    //   CONFIGURING TOAST TO TOAST MESSAGE
    const showToastMessage = useCallback((message: any, type: ToastType) => {
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
    }, []);


    const handleContentChange = () => {
      const contentEditable = contentEditableRef.current;
      if (contentEditable) {
        setContent(contentEditable.innerHTML);
        // contentEditable.style.height = 'auto';
        // contentEditable.style.height = `${contentEditable.scrollHeight}px`;

        // if (contentEditable.innerHTML.trim() === '') {
        //   contentEditable.innerHTML = '<p class="placeholder">Your content</p>';
        //   contentEditable.style.color = 'gray.400';
        // }
      }
    };


    const insertAtCursor = useCallback((html: string) => {
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
    }, [handleContentChange]);


    
    const insertText = useCallback((command: string, value: string = '') => {
      const contentEditable = contentEditableRef.current;
      if (!contentEditable) return;

      contentEditable.focus();
      const selection = window.getSelection();
      const selectedText = selection?.toString() || '';

      if (command === 'foreColor') {
        document.execCommand('foreColor', false, color);
      } else if (command === 'codeBlock') {
        const codeHtml = `<pre style="background: #f7f7f7; padding: 10px; border-radius: 4px; overflow-x: auto;"><code>${selectedText.trim() || 'Your code here'}</code></pre><p></p>`;
        insertAtCursor(codeHtml);
      } else if (command === 'blockquote') {
        const quoteHtml = `<blockquote style="border-left: 4px solid #4299e1; padding-left: 15px; margin: 15px 0; font-style: italic; color: #4a5568;">${selectedText.trim() || 'Your quote here'}</blockquote><p></p>`;
        insertAtCursor(quoteHtml);
      } else {
        document.execCommand(command, false, value);
      }
      handleContentChange();
    }, [color, handleContentChange, insertAtCursor]);



    const changeFontSize = useCallback((increment: number, buttonNumber: number) => {
      const newSize = activeButton === buttonNumber ? initialFontSize : initialFontSize + increment;
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
    }, [activeButton, initialFontSize, handleContentChange]);




    const handleFileUpload = async (type: string) => {
      const input = document.createElement("input");
      input.type = 'file';
      input.accept = type === 'image' ? 'image/*' : 'video/*';
      input.onchange = async (event: any) => {
        const files = event.target.files;
        if (files.length > 0) {
          showToastMessage(`Uploading ${files.length} file(s)...`, 'warning');
          const urls: string[] = [];
          for (const file of Array.from(files)) {
            const fileRef = ref(storage, `uploads/${Date.now()}-${(file as File).name}`);
            try {
              await uploadBytes(fileRef, file as File);
              const url = await getDownloadURL(fileRef);
              urls.push(url);
              const mediaElement = type === 'image'
                ? `<img src="${url}" alt="uploaded media" style="max-width: 100%; height: auto; display: block; margin: 15px auto; border-radius: 8px;" />`
                : `<video src="${url}" controls style="max-width: 100%; height: auto; display: block; margin: 15px auto; border-radius: 8px;"></video>`;
              insertAtCursor(`\n\n${mediaElement}\n<p></p>\n`);

            }
            catch (err) {
              console.error("Upload error:", err);
              showToastMessage(`Failed to upload ${(file as File).name}.`, 'error');
            }
          }
          setMediaUrls(prevUrls => [...prevUrls, ...urls]);
          showToastMessage('Files uploaded successfully!', 'success');
        }
      };
      input.click();
    }


    const savePost = async () => {
      if (!currentUser) {
        showToastMessage('Reader is not authenticated', 'warning');
        return;
      }

      const contentEditable = contentEditableRef.current?.innerHTML.trim() || '';
      if (contentEditable === '' || contentEditable === '<p class="placeholder">Your content</p>') {
          showToastMessage('Content cannot be empty.', 'warning');
          return;
      }

      try {
        const serializedContent = contentEditableRef.current!.innerHTML;
        const docRef = collection(firestore, 'datainformation');
        await addDoc(docRef, {
          title: title.trim(),
          content: serializedContent,
          category: topic.trim(),
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
          contentEditableRef.current.style.color = '#a0aec0';
        }
        showToastMessage('Post published successfully', 'success')
      }
      catch (err: any) {
        console.log('Error saving post', err);
        showToastMessage(err.message || 'An unknown error occurred while publishing', 'error')
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
      setShowColorPicker(prev => !prev);
    };



    const handleContinue = () => {
      const currentContent = contentEditableRef.current?.innerHTML.trim() || '';
      if (title.trim() !== '' && currentContent !== '' && currentContent !== '<p class="placeholder">Your content</p>') {
        onOpen();
      }
      else {
        showToastMessage('Please fill the title or post content', 'warning');
      }
    }


    const handleSave = (e: any) => {
      e.preventDefault();
      if (topic.trim() === '') {
        showToastMessage('Please fill the post Topic', 'warning');
        return;
      }
      savePost();
      onClose();
    }    


    const handleFocus = () => {
      if (contentEditableRef.current && contentEditableRef.current.innerHTML === '<p class="placeholder">Your content</p>') {
        contentEditableRef.current.innerHTML = '';
        contentEditableRef.current.style.color = 'inherit';
      }
    };


    const handleBlur = () => {
      if (contentEditableRef.current && contentEditableRef.current.innerHTML.trim() === '') {
        contentEditableRef.current.innerHTML = '<p class="placeholder">Your content</p>';
        contentEditableRef.current.style.color = '#a0aec0';
      }
    };



      

    
  return (
    <Box display='flex' flexDir='column' w='100%' alignItems='center' px={[2, 4]} py={[4, 8]} maxW={['95%', '90%', "75%", "6xl"]} mx='auto'>
        <Input type='text' value={title} onChange={(e) => setTitle(e.target.value)} variant='unstyled' placeholder='Title' _placeholder={{ opacity: 1, color: 'gray.400', fontSize: ['xl', '2xl', '3xl'] }} fontSize={['xl', '2xl', '3xl']} fontWeight='semibold' w='100%' size='lg' my={4} p={4} />
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

        <Box w="100%" borderRadius="xl" bg="white" boxShadow="2xl" overflow="hidden" position="relative">
          <Flex align="center" wrap="wrap" gap={[2, 3]} p={[2, 3]} position='sticky' top='0' bg='white' borderBottom='1px' borderColor='gray.200' zIndex='10' justifyContent='flex-start'>
              <Menu>
                <MenuButton
                  as={IconButton}
                  aria-label='Add media'
                  icon={<MdAdd size="1.5rem" />}
                  variant='outline'
                  color='gray.500'
                  borderRadius="full"
                  size="md"
                />
                <MenuList minW='auto' py={1} px={1} shadow="lg">
                  <MenuItem icon={<CiImageOn size='1.2rem' />} onClick={() => handleFileUpload('image')} _hover={{ bg: 'blue.50' }}>
                    Add Image
                  </MenuItem>
                  <MenuItem icon={<PiVideo size='1.2rem' />} onClick={() => handleFileUpload('video')} _hover={{ bg: 'blue.50' }}>
                    Add Video
                  </MenuItem>
                </MenuList>
              </Menu>

              <Flex gap={[1, 1.5]} flexWrap="wrap">
                <IconButton aria-label="Bold" icon={<MdFormatBold />} size='md' onClick={() => insertText('bold')} title="Bold" variant="ghost" />
                <IconButton aria-label="Italic" icon={<BsTypeItalic />} size='md' onClick={() => insertText('italic')} title="Italic" variant="ghost" />

                <Divider orientation="vertical" h="30px" mx={1} />

                <IconButton aria-label="Increase font" icon={<PiTextTThin />} size='md' onClick={() => changeFontSize(4, 1)} color={activeButton === 1 ? 'green.500' : 'gray.500'} title="Increase Font Size" variant="ghost" />
                <IconButton aria-label="Decrease font" icon={<PiTextTThin />} size='md' onClick={() => changeFontSize(-2, 2)} color={activeButton === 2 ? 'green.500' : 'gray.500'} title="Decrease Font Size" variant="ghost" />
                
                <Divider orientation="vertical" h="30px" mx={1} />
                
                <IconButton aria-label="Code block" icon={<AiTwotoneCode />} size='md' onClick={() => insertText('codeBlock')} title="Code Block" variant="ghost" />

                <Box position="relative">
                  <IconButton aria-label="Text color" icon={<IoIosColorPalette />} size="md" onClick={toggleColorPicker} title="Text Color" variant="ghost" />
                  {showColorPicker && (
                    <Box position="absolute" top="100%" left="0" mt={2} p={2} bg="white" shadow="xl" borderRadius="lg" zIndex="20">
                      <CirclePicker color={color} onChangeComplete={handleColorChange} width="180px" circleSize={24} circleSpacing={8}/>
                    </Box>
                  )}
                </Box>

                <IconButton aria-label="Blockquote" icon={<BsBlockquoteLeft />} size='md' onClick={() => insertText('blockquote')} title="Blockquote" variant="ghost" />
                
                <Divider orientation="vertical" h="30px" mx={1} />

                <IconButton aria-label="Undo" icon={<CiUndo />} size='md' onClick={() => insertText('undo')} title="Undo" variant="ghost" />
                <IconButton aria-label="Redo" icon={<CiRedo />} size='md' onClick={() => insertText('redo')} title="Redo" variant="ghost" />
              </Flex>
          </Flex>


          <Box ref={contentEditableRef} contentEditable onInput={handleContentChange} onFocus={handleFocus} onBlur={handleBlur} className="scroll editor-content" px={[4, 6, 8]} py={[6, 8]} minH="31.25rem" w='100%' overflowY="auto" fontSize={`${currentFontSize}px`} lineHeight="1.8" color='gray.600' _placeholder={{ opacity: 1, color: 'gray.400', fontSize: ['16px', '24px'] }} style={{ minHeight: '50px', color: 'gray.800', overflowY: 'auto', fontSize: `${currentFontSize}px` }} data-placeholder="Your content" _focus={{ border: 'none' }} />
        </Box>


          {/* Content Editable Area */}

          {/* {showColorPicker && (
            <Box>
              <CirclePicker 
                color={color} 
                onChangeComplete={handleColorChange} 
              />
            </Box>
          )} */}

          <Button onClick={handleContinue} mt={8} ml="auto" colorScheme="blue" borderRadius="full" size="lg" px={8} shadow="md" >
            Continue
          </Button>

          {/* Publish Modal */}
          <Modal isOpen={isOpen} onClose={onClose} size={['sm', 'md', 'lg']}>
            <ModalOverlay backdropFilter='blur(8px)' />
            <ModalContent borderRadius="xl" shadow="xl" bg='white'>
              <ModalHeader pt={5} fontSize="lg" fontWeight="semibold">Content preview</ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6} pt={6}>
                <FormControl>
                  <FormLabel color='gray.600' fontWeight='normal'>Add topic (up to 5) so readers know what your story is about</FormLabel>
                  <Input value={topic} onChange={(e) => setTopic(e.target.value)} placeholder="Add a topic" variant="outline" size="md" mt={8} _focus={{ borderColor: 'gray.500' }} />
                </FormControl>
              </ModalBody>
              <ModalFooter>
                <Button colorScheme="blue" onClick={handleSave} borderRadius="full" px={6} size="md" >
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