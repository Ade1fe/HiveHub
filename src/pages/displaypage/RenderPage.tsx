
import React from 'react';
import { Box, Image, Text, Link as ChakraLink } from '@chakra-ui/react';

interface CategoryDataProps {
  categories: string[];
  content: string;
  images: string[];
  links: string[];
  subtitleColors: string[];
  subtitles: string[];
  timestamp: Date | null;
  titleColors: string[];
  titles: string[];
}

interface RenderPageProps {
  categoryData: CategoryDataProps;
}

const RenderPage: React.FC<RenderPageProps> = ({ categoryData }) => {
  const {
    categories,
    content,
    images,
    links,
    subtitles,
    subtitleColors,
    titles,
    titleColors,
  } = categoryData;

  const renderContent = () => {
    const segments = content.split(/\[(.*?)\]/);
  
    return segments.map((segment, index) => {
      if (index % 2 === 0) {
        return <Text key={`segment-${index}`}>{segment}</Text>;
      } else {
        const [type, idx] = segment.split(':');
        switch (type) {
          case 'Title':
            return (
              <Text
                key={`segment-${index}`}
                fontWeight="bold"
                fontSize={["lg",'x-large', 'xx-large',]}
                color={titleColors[parseInt(idx)]}
                textTransform='capitalize'
               mt='1.5rem'
               className='heading'
              >
                {titles[parseInt(idx)]}
              </Text>
            );
          case 'Subtitle':
            return (
              <Text
                key={`segment-${index}`}
                fontWeight="medium"
                mb='0.4rem'
               className='subHeading'
                fontSize={[ 'md', "lg",'19px',]}
                color={subtitleColors[parseInt(idx)]}
              >
                {subtitles[parseInt(idx)]}
              </Text>
            );
          case 'Link':
            return (
              <ChakraLink key={`segment-${index}`} href={links[parseInt(idx)]} color='blue.600' _hover={{textDecoration: "underline"}}>
                {links[parseInt(idx)]}
              </ChakraLink>
            );
          case 'Image':
            // Check if there's only one image or multiple images
            if (images.length === 1 || parseInt(idx) === images.indexOf('default-image-url')) {
              // Render the single image or the image that matches the placeholder index
              return (
                <Box key={`image-${index}`} mt={2}  bg='red'p='2' w={['full', 'full', '80%', '90%']} mx='auto'>
                  <Image src={images[0]} w='full' h='full' objectFit='cover' />
                </Box>
              );
            } else if (images.length > 1 && images[parseInt(idx)]) {
              // Render the image that matches the placeholder index
              return (
                <Box key={`image-${index}`} mt={2} bg='green'  w={['full', 'full', '80%', '90%']} mx='auto'>
                  <Image src={images[parseInt(idx)]} w='full'  h='full' objectFit='cover'/>
                </Box>
              );
            } else {
              // Render the placeholder content
              return (
                <Box key={`segment-${index}`} mt={2} >
                  {/* <Image src="default-image-url" w='full' h='full' objectFit='cover' /> */}
                </Box>
              );
            }
          default:
            return null;
        }
      }
    });
  };
  
  
  

  return (
    <Box mt="40px" bg="gray.200" maxWidth='700px' mx='auto' p='2rem' className='texts'>
      <Text fontWeight="bold" fontSize="xl"> Category: <Text as='span' color='gray.600'>{categories[0]}</Text> </Text>
      {renderContent()}
    </Box>
  );
};

export default RenderPage;
