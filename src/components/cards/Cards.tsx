import { Box, Button, Image, Text } from "@chakra-ui/react"

const Cards = ({ posts, onItemClick }: {posts: any, onItemClick: (postId: string) => void}) => {
  return (
    <Box className="texts" my='4' >
        {posts.map((post: any) => (
            <Box key={post.id} onClick={() => onItemClick(post.id)} borderRadius='20px' overflow='hidden' display={['flex']} w='' shadow='base' _hover={{ bg: "#222", color: "white", transform: "scale(1.009)", transition: "transform 0.3s ease-in-out" , borderRadius: "20px" }} cursor='pointer' alignItems='center' gap='4' mb='15px' >
                <Box w={['70%']} px={['20px']} py='40px'>
                    <Box display="flex" gap='4'>
                        <Text bg='blue.100' w='fit-content' shadow='md' py='1' px='2' color='white' fontWeight='500' borderRadius='5'>{post.category}</Text>
                        <Text color='black'>{post.timestamp ? new Date(post.timestamp).toLocaleDateString() + " " + new Date(post.timestamp).toLocaleTimeString() : ''}</Text>
                    </Box>

                    <Box mt='2'>
                        <Text fontWeight='900' fontSize={['lg', 'xl', 'xx-large']}>{post.title}</Text>
                    </Box>

                    <Box mt='2'>
                        <Text noOfLines={[1, 2, 3]} dangerouslySetInnerHTML={{ __html: post.content}}></Text>
                    </Box>
                        
                    <Box display="flex" alignItems='center' gap='3' mt='4'>
                        <Button bg='blue.200' _hover={{ bg: "blue.100" }} py='2' px='5' borderRadius='100px' color='white'>Read full post</Button>
                        <Image boxSize='50px' borderRadius='50%' src={post.authorImage} alt={post.authorUsername} />
                        <Text fontWeight='700'>{post.authorUsername}</Text>
                    </Box>
                </Box>

                <Box className="" w='30%'>
                    {/* <Image w='full' h='310px' objectFit='cover' src={post.contentImage} alt={post.title} /> */}
                    {/* <Image w='full' h='310px' objectFit='cover' src={Array.isArray(post.contentImage) ? post.contentImage[0] : post.contentImage} alt={post.title} /> */}
                    {/* <Image w='full' h='310px' objectFit='cover' src={post.contentImage.length > 0 ? post.contentImage[0] : ''} alt={post.title} /> */}
                    {/* {post.contentImage.map((url: string | undefined, index: Key | null | undefined) => (
                        <Image w='full' h='310px' objectFit='cover' key={index} src={url} alt={`media-${index}`} />
                    ))} */}
                    {post.contentImage.length > 0 && (
                        <Image w='full' h='310px' objectFit='cover' src={post.contentImage[0]} alt={`media-0`} />
                    )}
                </Box>
            </Box>
        ))}
    </Box>
  )
}

export default Cards