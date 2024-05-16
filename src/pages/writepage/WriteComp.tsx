import React, { useState, useEffect } from 'react';
import { Box, Button, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Circle,  FormControl, FormLabel } from '@chakra-ui/react';
import {  FaPlusCircle,  } from 'react-icons/fa';
import { ChromePicker } from 'react-color';
import { v4 as uuidv4 } from 'uuid';
import { auth, firestore, storage } from '../../firebase';
import { User } from 'firebase/auth';
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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
  const [categories, setCategories] = useState<string[]>([]);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [categoryInput, setCategoryInput] = useState('');
  const [categoryAdded, setCategoryAdded] = useState(false);

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
          // const userDocRef = doc(firestore, 'coinbaseusers', currentUser.uid );
          const userDocRef = doc(firestore, 'coinbaseusers', 'dataInformation');
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
            setCategories(data.categories || []); // Retrieve categories
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      }
    };
    fetchData();
  }, [currentUser]);

  const saveContentToFirestore = async () => {
    if (!currentUser) {
      console.error('Error saving content to Firestore: User not authenticated.');
      return;
    }

    if (!content.trim()) {
      console.error('Error saving content to Firestore: Content is empty.');
      return;
    }

    try {
      const dataInfoCollectionRef = collection(firestore, 'datainformation');

      // Generate a unique ID for the new document
      const newDocRef = doc(dataInfoCollectionRef);

      // Ensure titleColors array has a valid color for each title
      let finalTitleColors = titleColors;
      if (!titles || titles.length === 0) {
        console.warn('No titles provided. Setting default values.');
        setTitles(['Untitled']);
      }
      if (!titleColors || titleColors.length === 0) {
        console.warn('No title colors provided. Setting default values.');
        finalTitleColors = ['#000000']; // Default color: black
      }
      if (titles.length > titleColors.length) {
        // If titles outnumber titleColors, assign default color for the missing titles
        const defaultColor = '#000000'; // Default color: black
        const missingColorsCount = titles.length - titleColors.length;
        finalTitleColors = titleColors.concat(new Array(missingColorsCount).fill(defaultColor));
        setTitleColors(finalTitleColors);
      }

      // Initialize data object with timestamp and default values for other fields
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const data: { [key: string]: any } = {
        timestamp: new Date(),
        content: content.trim(),
        titles: titles.length > 0 ? titles : null,
        subtitles: subtitles && subtitles.length > 0 ? subtitles : null,
        titleColors: finalTitleColors.length > 0 ? finalTitleColors : null,
        subtitleColors: subtitleColors && subtitleColors.length > 0 ? subtitleColors : null,
        links: links && links.length > 0 ? links : null,
        videos: videos && videos.length > 0 ? videos : null,
        images: images && images.length > 0 ? images : null,
        categories: categories && categories.length > 0 ? categories : null, // Include categories
      };

      console.log('Data to be saved:', data);

      // Set the document with the generated ID and data
      await setDoc(newDocRef, data);
      console.log('Content saved to Firestore successfully!');
    } catch (error) {
      console.error('Error saving content to Firestore:', error);
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
    saveContentToFirestore();
    (contentWithLinksAndColors);

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
    setCategories([]); // Clear categories after publishing
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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      try {
        const storageRef = ref(storage, file.name);
        await uploadBytes(storageRef, file);
        const imageUrl = await getDownloadURL(storageRef);
        setImageFileData((prevData: string[]) => [...prevData, imageUrl]);
        setContent((prevContent) => prevContent + `\n[Image:${imageFileData.length}]`);
        setImages((prevImages) => [...prevImages, imageUrl]);
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
      } else if (line === '[Category]' && categories.length > 0) {
        // Render categories if available
        elements.push(
          <Text key={index} fontSize="md" color="gray.500">
            {categories.join(', ')}
          </Text>
        );
      } 
      else {
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

  const handleCategoryInput = () => {
    setCategoryModalOpen(true);
  };



  // const handleAddCategory = () => {
  //   setCategories((prevCategories) => [...prevCategories, categoryInput]);
  //   setCategoryModalOpen(false);
  //   setCategoryInput('');
  
  //   // Update the content with the added category
  //   setContent((prevContent) => prevContent + `\n[Category]`);
  // };

  const handleAddCategory = () => {
    // Check if the category is already present in the categories state
    if (!categories.includes(categoryInput.trim())) {
      // If not present, add the category
      setCategories((prevCategories) => [...prevCategories, categoryInput.trim()]);
      setCategoryModalOpen(false);
      setCategoryInput('');
    
      // Update the content with the added category
      setContent((prevContent) => prevContent + `\n[Category]`);
      // Disable the "Add Category" button after adding the category
      setCategoryAdded(true);
    } else {
      // If the category is already present, show an alert or handle it accordingly
      alert("Category already exists!");
    }
  };
  

  
  const linkInputId = uuidv4();
  const titleInputId = uuidv4();
  const subtitleInputId = uuidv4();
  const imageInputId = uuidv4();
  const videoInputId = uuidv4();
  const categoryInputId = uuidv4();

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
          <MenuItem onClick={handleCategoryInput}>Add Category</MenuItem> 
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

      <Modal isCentered isOpen={categoryModalOpen} onClose={() => setCategoryModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Add Category</ModalHeader>
          <ModalBody>
            <Input
              id={categoryInputId}
              value={categoryInput}
              onChange={(e) => setCategoryInput(e.target.value)}
              placeholder="Enter category"
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddCategory} disabled={categoryAdded}>
              Add
            </Button>
            <Button onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Preview</ModalHeader>
          <ModalBody>
            {renderedContent}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePublish}>Publish</Button>
            <Button onClick={() => setPreviewModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default WriteComp;
