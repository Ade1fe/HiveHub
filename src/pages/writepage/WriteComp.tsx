

import React, { useState, useEffect } from 'react';
import { Box, Button, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Circle,  FormControl, FormLabel } from '@chakra-ui/react';
import {  FaPlusCircle,  } from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import { v4 as uuidv4 } from 'uuid';
import { auth, firestore, storage } from '../../firebase';
import { User } from 'firebase/auth';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import 'firebase/firestore';
import {  getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const WriteComp: React.FC = () => {
  const [content, setContent] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [videoFileData, setVideoFileData] = useState<string | null>(null);
  const [titles, setTitles] = useState<string[]>([]);
  const [subtitles, setSubtitles] = useState<string[]>([]);
  const [titleColors, setTitleColors] = useState<string[]>([]);
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [subtitleModalOpen, setSubtitleModalOpen] = useState(false);
  const [subtitleInput, setSubtitleInput] = useState('');
  const [subtitleColors, setSubtitleColors] = useState<string[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(auth.currentUser);
  const [renderedContent, setRenderedContent] = useState<JSX.Element[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [videos, setVideos] = useState<string[]>([]);
  const [imageFileData, setImageFileData] = useState<string[]>([]);

const [links, setLinks] = useState<string[]>([]); 

useEffect(() => {
  const fetchContent = async () => {
    const contentElements = await renderContentWithLinks();
    setRenderedContent(contentElements);
  };

  fetchContent();
}, [content, imageFileData, videoFileData]); 

useEffect(() => {
  const unsubscribe = auth.onAuthStateChanged((user: User | null) => {
    setCurrentUser(user);
  });
  return () => unsubscribe();
}, []);
 

  useEffect(() => {
    const fetchData = async () => {
      if (currentUser) {
        try {
          const userDocRef = doc(firestore, 'coinbaseusers', currentUser.uid);
          const docSnapshot = await getDoc(userDocRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setContent(data.content);
            setTitles(data.titles || []);
            setSubtitles(data.subtitles || []);
            setTitleColors(data.titleColors || []);
            setSubtitleColors(data.subtitleColors || []);
            setLinkInput(data.linkInput || []);
            setImageFileData(data.imageFileData || []);
            setImages(data.images || []);
            setVideoFileData(data.videoFileData || []);
            setVideos(data.videos || []);
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      }
    };
    fetchData();
  }, [currentUser]);



  const saveContentToFirestore = async () => {
    if (currentUser) {
      try {
        const dataInfoCollectionRef = collection(firestore, 'datainformation');
  
        // Generate a unique ID for the new document
        const newDocRef = doc(dataInfoCollectionRef);
  
        // Initialize data object with timestamp, userId, and content if available
        const data: { [key: string]: any } = {
          timestamp: new Date(),
          userId: currentUser.uid,
        };
  
        // Add fields only if they are not empty
        if (content.trim() !== '') data.content = content;
        if (titles.length > 0) data.titles = titles;
        if (subtitles.length > 0) data.subtitles = subtitles;
        if (titleColors.length > 0) data.titleColors = titleColors;
        if (subtitleColors.length > 0) data.subtitleColors = subtitleColors;
        if (links.length > 0) data.links = links;
        if (videos.length > 0) data.videos = videos;
        if (images.length > 0) data.images = images;
  
        // Set the document with the generated ID and data
        await setDoc(newDocRef, data);
        console.log('Content saved to Firestore successfully!');
      } catch (error) {
        console.error('Error saving content to Firestore:', error);
      }
    }
  };
  


  const handlePublish = async () => {
    const contentWithLinksAndColors = (await renderContentWithLinks())
      .filter((element): element is JSX.Element => !!element)
      .map((element) => {
        if (typeof element === 'object' && element.type === 'img') {
          return `<img src="${element.props.src}" alt="${element.props.alt}" style="max-width: '100%'; max-height: '300px';" />`;
        } else if (typeof element === 'object' && element.type === 'video') {
          return `<video controls style="max-width: '100%'; max-height: '300px';"><source src="${element.props.src}" type="video/mp4" /></video>`;
        } else if (typeof element === 'object' && element.type === 'p') {
          return `<p style="font-size: ${element.props.fontSize}; color: ${element.props.color};">${element.props.children}</p>`;
        } else {
          return element.props.children;
        }
      })
      .join('');
  
    setPreviewModalOpen(false);
    (contentWithLinksAndColors);
    saveContentToFirestore();
   
    // Convert links array to a single string
    const linksString = links.join('\n');
  
  
  
    setContent('');
    setImageFileData([""]);
    setVideoFileData(null);
    setTitles([]);
    setSubtitles([]);
    setTitleColors([]);
    setSubtitleColors([]);
    setLinkInput('');
    setTitleInput('');
    setImages([]);
    setSubtitleInput('');
    setVideos([]);
  };
  
  

  const handleInsertLink = () => {
    setLinkModalOpen(true);
  };

  const handleAddLink = () => {
    setLinks((prevLinks) => [...prevLinks, linkInput]);
    setContent((prevContent) => prevContent + `\n[Link:${links.length}]`);
    setLinkInput('');
    setLinkModalOpen(false);
  };


 

  const handleVideoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      try {
        const storageRef = ref(storage, file.name);
        await uploadBytes(storageRef, file);
        const videoUrl = await getDownloadURL(storageRef);
        setVideoFileData(videoUrl); // Update to set a single video URL
      } catch (error) {
        console.error('Error uploading video:', error);
      }
    }
  };
  



 // Inside handleImageChange function
const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files ? e.target.files[0] : null;
  if (file) {
    try {
      const storageRef = ref(storage, file.name);
      await uploadBytes(storageRef, file);
      const imageUrl = await getDownloadURL(storageRef);
      setImageFileData((prevData: string[]) => [...prevData, imageUrl]);
      // Append image placeholder to content
      setContent((prevContent) => prevContent + `\n[Image:${imageFileData.length}]`);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  }
};

  
  

const renderContentWithLinks = async (): Promise<JSX.Element[]> => {
  if (!content) return [];

  const elements: JSX.Element[] = [];
  let currentTitleIndex = -1; // Initialize the current title index

  const lines = content.split('\n');
  for (let index = 0; index < lines.length; index++) {
    const line = lines[index];

    if (line.startsWith('[Link:')) {
      const linkIndex = parseInt(line.substring(6, line.length - 1), 10);
      if (links[linkIndex]) {
        elements.push(
          <Text key={index} color="blue" textDecoration="underline" cursor="pointer" fontSize="md">
            {links[linkIndex]}
          </Text>
        );
      }
    } else if (line.startsWith('[Title:')) {
      currentTitleIndex = parseInt(line.substring(7, line.length - 1), 10);
      elements.push(
        <Text key={index} fontSize="2xl" fontWeight="bold" color={titleColors[currentTitleIndex]}>
          {titles[currentTitleIndex]}
        </Text>
      );
    } else if (line.startsWith('[Subtitle:')) {
      const subtitleIndex = parseInt(line.substring(10, line.length - 1), 10);
      if (subtitles[subtitleIndex]) {
        elements.push(
          <Text key={index} fontSize="lg" color={subtitleColors[subtitleIndex]}>
            {subtitles[subtitleIndex]}
          </Text>
        );
      }
    } else if (line.startsWith('[Image:') && imageFileData) {
      const imageIndex = parseInt(line.substring(7, line.length - 1), 10);
      try {
        const imageUrl = imageFileData[imageIndex];
        elements.push(
          <img key={index} src={imageUrl} alt={`Image ${imageIndex}`} style={{ maxWidth: '100%', maxHeight: '300px' }} />
        );
      } catch (error) {
        console.error('Error fetching image:', error);
      }
    } else if (line === '[Video]' && currentTitleIndex !== -1 && videoFileData) {
      try {
        const videoUrl = videos[currentTitleIndex]; // Get the corresponding video URL
        elements.push(
          <video key={index} controls style={{ maxWidth: '100%', maxHeight: '300px' }}>
            <source src={videoUrl} type="video/mp4" />
          </video>
        );
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    } else {
      // Treat each line as a paragraph
      elements.push(<Text key={index} fontSize="sm">{line}</Text>);
    }
  }

  return elements;
};



  
  

  const handleAddTitle = () => {
    setTitleModalOpen(true);
  };

  const handleAddSubtitle = () => {
    setSubtitleModalOpen(true);
  };

  const handlePreview = () => {
    setContent(
      content 
    );
    setPreviewModalOpen(true);
  };
  

  const handleAddTitleConfirm = () => {
    const newTitles = [...titles, titleInput];
    const newTitleColors = [...titleColors, titleColors[titleColors.length - 1]];
    setTitles(newTitles);
    setTitleColors(newTitleColors);
    setContent((prevContent) => prevContent + `\n[Title:${newTitles.length - 1}]`);
    setTitleModalOpen(false);
    setTitleInput('');
  };

  const handleAddSubtitleConfirm = () => {
    const newSubtitles = [...subtitles, subtitleInput];
    const newSubtitleColors = [...subtitleColors, subtitleColors[subtitleColors.length - 1]];
    setSubtitles(newSubtitles);
    setSubtitleColors(newSubtitleColors);
    setContent((prevContent) => prevContent + `\n[Subtitle:${newSubtitles.length - 1}]`);
    setSubtitleModalOpen(false);
    setSubtitleInput('');
  };

  const linkInputId = uuidv4();
  const titleInputId = uuidv4();
  const subtitleInputId = uuidv4();
  const imageInputId = uuidv4();
  const videoInputId = uuidv4();
  // const paragraphInputId = uuidv4();

  return (
    <Box p={4}>
      <Text fontSize="xl" fontWeight="bold" mb={4} color="black">Tell us your STORY</Text>

      <Menu>
        <MenuButton
          px={4}
          py={2}
          transition='all 0.2s'
          borderRadius='md'
          borderWidth='1px'
          _hover={{ bg: 'gray.400' }}
          _expanded={{ bg: 'blue.400' }}
          _focus={{ boxShadow: 'outline' }}
        >
          <Icon as={FaPlusCircle} boxSize={6} />
        </MenuButton>
        <MenuList>
          <MenuItem onClick={handleAddTitle}>Add Title</MenuItem>
          <MenuItem onClick={handleAddSubtitle}>Add Subtitle</MenuItem>
          <MenuItem onClick={handleInsertLink}>Insert Link</MenuItem>
          <MenuDivider />
          <MenuItem onClick={() => setImageModalOpen(true)}>Add Image</MenuItem>
          <MenuItem onClick={() => setVideoModalOpen(true)}>Add Video</MenuItem>
        </MenuList>
      </Menu>

      <Box mt={4} shadow='md'>
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)} 
          placeholder='Tell us your story'
          rows={20}
        />
      </Box>

      <Button mt={4} colorScheme="blue" onClick={handlePreview}>Preview</Button>

      <Modal isCentered isOpen={linkModalOpen} onClose={() => setLinkModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Add Link</ModalHeader>
          <ModalBody >
            <Input id={linkInputId} value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder="Enter link URL" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddLink}>Add</Button>
            <Button onClick={() => setLinkModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Add Image</ModalHeader>
          <ModalBody>
            <Input id={imageInputId} type="file" accept="image/*" onChange={handleImageChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
              setContent((prevContent) => prevContent + '\n[Image]');
              setImageModalOpen(false);
            }}>Add</Button>
            <Button onClick={() => setImageModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Add Video</ModalHeader>
          <ModalBody>
            <Input id={videoInputId} type="file" accept="video/*" onChange={handleVideoChange} />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => {
              setContent((prevContent) => prevContent + '\n[Video]');
              setVideoModalOpen(false);
            }}>Add</Button>
            <Button onClick={() => setVideoModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered isOpen={titleModalOpen} onClose={() => setTitleModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Add Title</ModalHeader>
          <ModalBody>
            <Input id={titleInputId} value={titleInput} onChange={(e) => setTitleInput(e.target.value)} placeholder="Enter title" />
            <Box mt={4}>
              <FormControl>
                <FormLabel>Choose Title Color</FormLabel>
                <Circle size="32px" bg={titleColors[titleColors.length - 1]} mb={2} />
                <ChromePicker
                  color={titleColors[titleColors.length - 1]}
                  onChange={(color) => {
                    const newColor = color.hex;
                    setTitleColors((prevColors) => [
                      ...prevColors.slice(0, -1),
                      newColor,
                    ]);
                  }}
                />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddTitleConfirm}>Add</Button>
            <Button onClick={() => setTitleModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered isOpen={subtitleModalOpen} onClose={() => setSubtitleModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Add Subtitle</ModalHeader>
          <ModalBody>
            <Input id={subtitleInputId} value={subtitleInput} onChange={(e) => setSubtitleInput(e.target.value)} placeholder="Enter subtitle" />
            <Box mt={4}>
              <FormControl>
                <FormLabel>Choose Subtitle Color</FormLabel>
                <Circle size="32px" bg={subtitleColors[subtitleColors.length - 1]} mb={2} />
                <ChromePicker
                  color={subtitleColors[subtitleColors.length - 1]}
                  onChange={(color) => {
                    const newColor = color.hex;
                    setSubtitleColors((prevColors) => [
                      ...prevColors.slice(0, -1),
                      newColor,
                    ]);
                  }}
                />
              </FormControl>
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddSubtitleConfirm}>Add</Button>
            <Button onClick={() => setSubtitleModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      
      <Modal isCentered isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)} size="xl">
  <ModalOverlay />
  <ModalContent bg='white'>
    <ModalHeader>Preview</ModalHeader>
    <ModalBody>
      <Box mt={4} shadow='md' p='10px'>
        {renderedContent.map((element, index) => (
          <React.Fragment key={index}>{element}</React.Fragment>
        ))}
      </Box>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={handlePublish}>
        Publish
      </Button>
      <Button onClick={() => setPreviewModalOpen(false)}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>

    </Box>
  );
}

export default WriteComp;






































