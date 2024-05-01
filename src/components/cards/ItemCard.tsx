
import React from 'react';
import { Box, Button, Image, Text } from '@chakra-ui/react';

<<<<<<< HEAD
interface Author {
  name: string;
  avatar: string;
=======
const ItemCard = () => {
  return (
    <Box>
     <Box className="" >
      <Text > Design</Text>
      <Text> 29 Jun 2021</Text>
     </Box>

     <Box className="" >
      <Text> Our new Desgn</Text>
     </Box>

     <Box className="" >
      <Text>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Similique, cupiditate vero quo deleniti rem eveniet!</Text>
     </Box>
      
     <Box className="" >
      <Button> Desifn</Button>
      <Text>by Micheell Crige</Text>
     </Box>

    </Box>
  )
>>>>>>> origin/main
}

interface ItemCardProps {
  category: string;
  date: string;
  title: string;
  description: string;
  author: Author;
  imageSrc: string;
}


const ItemCard: React.FC<ItemCardProps> = ({ category, date, title, description, author, imageSrc }) => {
  return (
    <Box className="" my='4'>
      <Box className="" display={['flex']} w='' shadow='base' _hover={{ bg: "black", color: "white" }} cursor='pointer' alignItems='center' gap='4'>
        <Box w={['70%']} px={['20px']} py='40px'>
          <Box display="flex" gap='4'>
            <Text bg='blue.100' w='fit-content' shadow='md' py='1' px='2' color='white' fontWeight='500' borderRadius='5'> {category}</Text>
            <Text> {date}</Text>
          </Box>

          <Box className="" mt='2'>
            <Text fontWeight='900' fontSize={['lg', 'xl', 'xx-large']}> {title}</Text>
          </Box>

          <Box className="" mt='2'>
            <Text noOfLines={[1, 2, 3]}>{description}</Text>
          </Box>

          <Box display="flex" alignItems='center' gap='3' mt='4'>
            <Button bg='blue.200' _hover={{ bg: "blue.100" }} py='2' px='5' borderRadius='100px' color='white'> Read full post</Button>
            <Box className="" display="flex" alignItems='center' gap='2'>
              <Image boxSize='50px' borderRadius='50%' src={author.avatar} alt={author.name} />
              <Text fontWeight='700'>by {author.name}</Text>
            </Box>
          </Box>
        </Box>

        <Box className="" w='30%'>
          <Image w='full' h='full' objectFit='cover' src={imageSrc} alt={title} />
        </Box>
      </Box>
    </Box>
  );
}

export default ItemCard;
