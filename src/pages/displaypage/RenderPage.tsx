import { useEffect, useState } from 'react';
import { Box, Image, Text, Link as ChakraLink } from '@chakra-ui/react';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '../../firebase';

interface CategoryDataProps {
  categories: string[];
  content: string;
  images: string[];
  links: string[];
  subtitleColors: string[];
  subtitles: string[];
  timestamp: Timestamp | null;
  titleColors: string[];
  titles: string[];
  userId: string;
}

interface DisplayProps {
  itemId: string;
}

interface UserProfileData {
  username: string;
  userImage: string;
}

interface RenderPageProps {
  categoryData: CategoryDataProps;
  itemData: DisplayProps
}

const RenderPage: React.FC<RenderPageProps> = ({ categoryData, itemData }) => {

  const { itemId } = itemData;

  const [fetchedCategoryData, setFetchedCategoryData] = useState<CategoryDataProps | null>(null); 
  const [timestamp, setTimestamp] = useState<Date | null>(null);
  const [UserProfileData, setUserProfileData] = useState<UserProfileData | null>(null);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const documentRef = doc(firestore, 'datainformation', itemId);
          const docSnapshot = await getDoc(documentRef);
          if (docSnapshot.exists()) {
            const data = docSnapshot.data() as CategoryDataProps;
            setFetchedCategoryData(data); 
            if (data.timestamp) {
              // Parse the timestamp into a Date object
              const parsedTimestamp = new Date(data.timestamp.seconds * 1000); // Firebase timestamp is in seconds
              setTimestamp(parsedTimestamp);
            } else {
              setTimestamp(null);
            }
            if (data.userId) {
              await fetchUserProfileData(data.userId);
              console.log("User profile data fetched successfully");
            }
          } else {
            console.log('Document does not exist');
          }
        } catch (error) {
          console.error('Error fetching document:', error);
        }
      };
  
      fetchData();
    }, [itemId]);




    const fetchUserProfileData = async (userId: string) => {
      try {
        const userDocRef = doc(firestore, 'Reader', userId);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
          const userData = userDocSnapshot.data() as UserProfileData;
          setUserProfileData(userData);
        }
        else {
          console.log('Content creator invalid')
        }
      }
      catch (err) {
        console.log('Error fetching user profile data: ', err);
      }
    }






  const renderContent = (data: CategoryDataProps) => {
    const {
      // @ts-ignore
      categories,
      content,
      images,
      links,
      subtitles,
      subtitleColors,
      titles,
      titleColors,
    } = data;

    const segments = content.split(/\[(.*?)\]/);
  
    return segments.map((segment, index) => {
      if (index % 2 === 0) {
        return <Text key={`segment-${index}`}>{segment}</Text>;
      } else {
        const [type, idx] = segment.split(':');
        switch (type) {
          case 'Title':
            return (
              <Box key={`segment-${index}`} display='flex' flexDir='column' gap='5px' mb='5px' >
                <Text
                  fontWeight='800'
                  fontSize={["large", 'x-large', 'xx-large',]}
                  color={titleColors[parseInt(idx)]}
                  textTransform='capitalize'
                  className='heading'
                >
                  {titles[parseInt(idx)]}
                </Text>
                {UserProfileData && (
                  <Box display="flex" alignItems="center" >
                    <Image src={UserProfileData.userImage} borderRadius="full" boxSize="30px" mr={2} />
                    <Text fontWeight="bold" fontSize={["md",'md', 'base']}>{UserProfileData.username}</Text>
                  </Box>
                )}
                <Box display='flex' gap='20px'>
                  <Text fontWeight="semibold" fontSize="sm" color='gray.400'> Published in: <Text as='span' color='gray.800'>{dataToRender.categories[0]}</Text> </Text>
                  {timestamp && (
                    <Text fontSize="sm" color="gray.500">
                      Last updated: {timestamp.toLocaleDateString()} {timestamp.toLocaleTimeString()}
                    </Text>
                  )}
                </Box>
              </Box>
              
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
  
  
  const dataToRender = fetchedCategoryData || categoryData;

  if (!dataToRender) {
    return <Box></Box>;
  }
  

  return (
    <Box mt="40px" maxWidth='1024px' mx='auto' p='2rem' className='texts'>
      {renderContent(dataToRender)}
    </Box>
  );
};

export default RenderPage;
