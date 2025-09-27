import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../../firebase";
import { Box, Flex, Heading, Image, Spinner, Text } from "@chakra-ui/react";
import { Prose } from "@nikolovlazar/chakra-ui-prose";

const RenderPost = () => {
  const { postId } = useParams();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<any>(null);

  useEffect(() => {
    const fetchPost = async () => {
      if (postId) {
        try {
          const postDoc = doc(firestore, 'datainformation', postId);
          const postSnap = await getDoc(postDoc);
          if (postSnap.exists()) {
            const postData = postSnap.data();
            const parser = new DOMParser();
            const docContent = parser.parseFromString(postData.content || '', 'text/html');
            const mediaElements = Array.from(docContent.querySelectorAll('img, video'));
            const mediaUrls = mediaElements.map(media => media.getAttribute('src'));
            setPost({
              ...postData,
              contentImage: mediaUrls,
              timestamp: postData.timestamp?.toDate() ? postData.timestamp.toDate() : new Date(),
            });
            setLoading(false);
          }
          else {
            setLoading(false);
          }
        }
        catch (err) {
          console.error("Error fetching post:", err);
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="50vh">
        <Spinner size="lg" color="blue.500" />
      </Flex>
    );
  }

  if (!post) {
    return (
      <Box p='8' textAlign='center'>
        <Heading size="lg">Post Not Found</Heading>
        <Text mt="2" color="gray.500">The article you are looking for does not exist or requires the ID '{postId}'.</Text>
      </Box>
    );
  }
  
  return (
    <Box mt={{ base: '6', md: '10' }} maxWidth='900px' mx='auto' px={{ base: '4', md: '0' }} className='texts'>
      <Box pb='6'>
        <Text textTransform='uppercase' fontWeight="bold" fontSize="sm" color='gray.400' mb='2'> Published in: <Text as='span' color='gray.600'>{post.category || 'Uncategorized'}</Text></Text>
        <Heading as='h1' fontWeight='800' size='xl' textTransform='capitalize' className='heading' mb='6'>{post.title}</Heading>
        <Flex gap={{ base: '2', md: '3' }} align='center' color="gray.600" borderBottom='1px solid' borderColor='gray.200' pb='2' wrap='wrap'>
          <Image src={post.authorImage} alt={post.username} borderRadius="full" boxSize="8" objectFit="cover" mr={2} />
          <Text fontWeight='semibold' fontSize='sm'>{post.username}</Text>
          <Text color="gray.300">|</Text>
          <Text fontSize="sm" whiteSpace='nowrap'>Last updated: {post.timestamp ? post.timestamp.toLocaleDateString() + " " + post.timestamp.toLocaleTimeString() : 'Unknown'}</Text>
        </Flex>

      </Box>
      
      <Box className='texts' pb='20'>
        <Prose>
          <Text fontSize='medium' color="gray.500" dangerouslySetInnerHTML={{ __html: post.content}}></Text>
        </Prose>
        {post.mediaUrls && post.mediaUrls.map((url: string, index: number) => (
          <Box key={index} mt='10px'>
            {url.endsWith('.mp4') ? (
              <video src={url} controls style={{ maxWidth: '100%', display: 'block', margin: '10px 0' }}></video>
            ) : (
              <Image src={url} alt={`media-${index}`} style={{ maxWidth: '100%', display: 'block', margin: '10px 0' }} />
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default RenderPost