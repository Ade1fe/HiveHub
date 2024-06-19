import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { firestore } from "../../firebase";
import { Box, Image, Text } from "@chakra-ui/react";
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
            const docContent = parser.parseFromString(postData.content, 'text/html');
            console.log(docContent);
            const mediaElements = Array.from(docContent.querySelectorAll('img, video'));
            console.log(mediaElements);
            const mediaUrls = mediaElements.map(media => media.getAttribute('src'));
            console.log(mediaUrls);
            setPost({
              ...postData,
              contentImage: mediaUrls,
              timestamp: postData.timestamp?.toDate(),
            });
            setLoading(false);
          }
          else {
            setLoading(false);
          }
        }
        catch (err) {
          console.error(err);
          setLoading(false);
        }
      }
    };

    fetchPost();
  }, [postId]);

  if (loading) {
    return <Box>Loading...</Box>
  }
  
  return (
    <Box mt="40px" maxWidth='1024px' mx='auto' p='2rem' className='texts'>
      <Box display='flex' flexDir='column' gap='5px' mb='5px'>
        <Text fontWeight='800' fontSize={["large", 'x-large', 'xx-large',]} textTransform='capitalize' className='heading'>{post.title}</Text>
        <Box display='flex' gap='10px' alignItems='center'>
          <Image src={post.authorImage} alt={post.username} borderRadius="full" boxSize="30px" mr={2} />
          <Box display='flex' flexDir='column' gap='5px'>
            <Text fontWeight='400' fontSize={["md",'md', 'base']}>{post.username}</Text>
            <Box display='flex' gap='15px' alignItems='center'>
              <Text fontWeight="400" fontSize="sm" color='gray.400'> Published in: <Text as='span' color='gray.600'>{post.category}</Text></Text>
              <Text fontSize="sm" color="gray.500">Last updated: {post.timestamp ? post.timestamp.toLocaleDateString() + " " + post.timestamp.toLocaleTimeString() : 'Unknown'}</Text>
            </Box>
          </Box>
        </Box>

        <Box>
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
    </Box>
  )
}

export default RenderPost