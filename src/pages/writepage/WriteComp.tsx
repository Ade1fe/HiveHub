import React, { useState } from 'react';
import { Box, Button, Icon, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Text, Textarea, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalFooter, Input, Circle,  FormControl, FormLabel } from '@chakra-ui/react';
import { FaCameraRetro, FaPlusCircle, FaVideo } from 'react-icons/fa';
import { ChromePicker } from 'react-color';

const WriteComp: React.FC = () => {
  const [content, setContent] = useState('');
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [titles, setTitles] = useState<string[]>([]);
  const [subtitles, setSubtitles] = useState<string[]>([]);
  const [titleColors, setTitleColors] = useState<string[]>([]);
  const [titleModalOpen, setTitleModalOpen] = useState(false);
  const [titleInput, setTitleInput] = useState('');
  const [subtitleModalOpen, setSubtitleModalOpen] = useState(false);
  const [subtitleInput, setSubtitleInput] = useState('');
  const [subtitleColors, setSubtitleColors] = useState<string[]>([]);
  const [previewModalOpen, setPreviewModalOpen] = useState(false); 

  const handleInsertLink = () => {
    setLinkModalOpen(true);
  };

  const handleAddLink = () => {
    setContent((prevContent) => prevContent + `\n[Link: ${linkInput}]`);
    setLinkInput('');
    setLinkModalOpen(false);
  };

  const handleAddImage = () => {
    setImageModalOpen(true);
  };

  const handleAddVideo = () => {
    setVideoModalOpen(true);
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setVideoFile(file);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImageFile(file);
    }
  };

  const handleAddNewBlock = () => {
    setContent((prevContent) => prevContent + '\n[New Block]');
  };

  const handleAddTitle = () => {
    setTitleModalOpen(true);
  };

  const handleAddSubtitle = () => {
    setSubtitleModalOpen(true);
  };



  const handlePreview = () => {
    setPreviewModalOpen(true); // Open preview modal
  };

  const handleLinkClick = (link: string) => {
    window.open(link, '_blank');
  };

  const renderContentWithLinks = () => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('[Link:')) {
        const link = line.substring(6, line.length - 1);
        return (
          <Text key={index} onClick={() => handleLinkClick(link)} color="blue" textDecoration="underline" cursor="pointer" fontSize="md">
            {link}
          </Text>
        );
      } else if (line === '[Image]' && imageFile) {
        const imageUrl = URL.createObjectURL(imageFile);
        return <img key={index} src={imageUrl} alt="Uploaded Image" style={{ maxWidth: '100%', maxHeight: '300px' }} />;
      } else if (line === '[Video]' && videoFile) {
        const videoUrl = URL.createObjectURL(videoFile);
        return <video key={index} controls style={{ maxWidth: '100%', maxHeight: '300px' }}><source src={videoUrl} type="video/mp4" /></video>;
      } else {
        // Assuming line is a paragraph or a title/subtitle reference
      // Assuming line is a paragraph or a title/subtitle reference
if (line.startsWith('[Title:')) {
  const titleIndex = parseInt(line.substring(7, line.length - 1), 10);
  return <Text key={index} fontSize="2xl" fontWeight="bold" color={titleColors[titleIndex]}>{titles[titleIndex]}</Text>;
} else if (line.startsWith('[Subtitle:')) {
  const subtitleIndex = parseInt(line.substring(10, line.length - 1), 10);
  return <Text key={index} fontSize="lg" color={subtitleColors[subtitleIndex]}>{subtitles[subtitleIndex]}</Text>;
} else {
  // Paragraph
  return <Text key={index} fontSize="sm">{line}</Text>;
}

      }
    });
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
          <MenuItem onClick={handleAddNewBlock}>Add New Block</MenuItem>  
           <MenuDivider />
          <MenuItem onClick={handleAddImage}><Icon as={FaCameraRetro} boxSize={6} /> Add Photo </MenuItem>
          <MenuItem onClick={handleAddVideo}><Icon as={FaVideo} boxSize={6} /> Add Video </MenuItem>      
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
            <Input value={linkInput} onChange={(e) => setLinkInput(e.target.value)} placeholder="Enter link URL" />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAddLink}>Add</Button>
            <Button onClick={() => setLinkModalOpen(false)}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isCentered  isOpen={imageModalOpen} onClose={() => setImageModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Add Image</ModalHeader>
          <ModalBody>
            <Input type="file" accept="image/*" onChange={handleImageChange} />
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

      <Modal isCentered  isOpen={videoModalOpen} onClose={() => setVideoModalOpen(false)}>
        <ModalOverlay />
        <ModalContent bg='white'>
          <ModalHeader>Add Video</ModalHeader>
          <ModalBody>
            <Input type="file" accept="video/*" onChange={handleVideoChange} />
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
            <Input value={titleInput} onChange={(e) => setTitleInput(e.target.value)} placeholder="Enter title" />
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
            <Input value={subtitleInput} onChange={(e) => setSubtitleInput(e.target.value)} placeholder="Enter subtitle" />
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

<Modal isCentered  isOpen={previewModalOpen} onClose={() => setPreviewModalOpen(false)} size="xl"> {/* Preview modal */}
  <ModalOverlay />
  <ModalContent bg='white'>
    <ModalHeader>Preview</ModalHeader>
    <ModalBody>
      <Box mt={4} shadow='md' p='10px'>
        {renderContentWithLinks()}
      </Box>
    </ModalBody>
    <ModalFooter>
      <Button colorScheme="blue" mr={3} onClick={() => {
        console.log('Published:', content);
        console.log('Uploaded image:', imageFile);
        console.log('Uploaded video:', videoFile); 
        setPreviewModalOpen(false); // Close preview modal
        // Reset content state or perform other actions as needed
        // setContent('');
        // setImageFile(null);
        // setVideoFile(null);
      }}>Publish</Button>
      <Button onClick={() => setPreviewModalOpen(false)}>Cancel</Button>
    </ModalFooter>
  </ModalContent>
</Modal>
    </Box>
  );
}

export default WriteComp
