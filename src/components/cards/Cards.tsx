import { Box, Button, Image, Text } from "@chakra-ui/react"

const Cards = ({ posts, onItemClick }: {posts: any, onItemClick: (postId: string) => void}) => {
  return (
    <Box className="texts" my='4' >
        {posts.map((post: any) => (
            <Box key={post.id} onClick={() => onItemClick(post.id)} h={['220px', null, '280px']} borderRadius='20px' overflow='hidden' display={['flex']} w='full' shadow='base' _hover={{ bg: "#222", color: "white", transform: "scale(1.009)", transition: "transform 0.3s ease-in-out" , borderRadius: "20px" }} cursor='pointer' alignItems='center' gap='4' mb='15px' >
                <Box w={['70%']} flex={['1', null, '7']} p={['4', '6']}>
                    <Box display="flex" gap='4' mb='2'>
                        <Text bg='blue.100' w='fit-content' fontSize='sm' shadow='md' py='0.5' px='2' color='white' fontWeight='500' borderRadius='full'>{post.category}</Text>
                        <Text color='gray.500' fontSize='sm' alignSelf='center'>{post.timestamp ? new Date(post.timestamp).toLocaleDateString() + " " + new Date(post.timestamp).toLocaleTimeString() : ''}</Text>
                    </Box>

                    <Box mb='2'>
                        <Text fontWeight='900' fontSize={['md', 'lg', 'xl']} noOfLines={3}>{post.title}</Text>
                    </Box>

                    <Box mb='4'>
                        <Text noOfLines={[2, 3]} dangerouslySetInnerHTML={{ __html: post.content}}></Text>
                    </Box>
                        
                    <Box display="flex" alignItems='center' gap='3'>
                        <Button bg='blue.500' _hover={{ bg: "blue.600" }} size='sm' px='5' borderRadius='full' color='white'>Read full post</Button>
                        <Image boxSize='8' borderRadius='full' src={post.authorImage} alt={post.authorUsername} />
                        <Text fontWeight='semibold' fontSize='sm'>{post.authorUsername}</Text>
                    </Box>
                </Box>

                <Box className="" flex={['0', null, '3']} display={['none', null, 'block']} w='30%'>
                    {/* <Image w='full' h='310px' objectFit='cover' src={post.contentImage} alt={post.title} /> */}
                    {/* <Image w='full' h='310px' objectFit='cover' src={Array.isArray(post.contentImage) ? post.contentImage[0] : post.contentImage} alt={post.title} /> */}
                    {/* <Image w='full' h='310px' objectFit='cover' src={post.contentImage.length > 0 ? post.contentImage[0] : ''} alt={post.title} /> */}
                    {/* {post.contentImage.map((url: string | undefined, index: Key | null | undefined) => (
                        <Image w='full' h='310px' objectFit='cover' key={index} src={url} alt={`media-${index}`} />
                    ))} */}
                    {post.contentImage.length > 0 && (
                        <Image w='full' h='full' objectFit='cover' src={post.contentImage[0]} alt={`media-0`} />
                    )}
                </Box>
            </Box>
        ))}
    </Box>
  )
}

export default Cards