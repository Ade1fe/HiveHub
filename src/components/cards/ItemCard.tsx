
import React from 'react';
import { Box, Button, Image, Text } from '@chakra-ui/react';

interface Author {
  name?: string;
  avatar?: string;
}

interface ItemCardProps {
  itemcardId? : string;
  category?: string;
  date?: string;
  title?: string;
  description?: string;
  author?: Author;
  imageSrc?: string;
  onItemClick: () => void;

}


const ItemCard: React.FC<ItemCardProps> = ({ itemcardId, category, date, title, description, author, imageSrc, onItemClick }) => {
  return (
    <Box className="texts" my='4' onClick={onItemClick}>
      <Text className="" display='none'>{itemcardId} </Text>
      <Box className="" borderRadius='20px'   overflow='hidden' display={['flex']} w='' shadow='base' _hover={{ bg: "#222", color: "white", transform: "scale(1.009)", transition: "transform 0.3s ease-in-out" , borderRadius: "20px" }} cursor='pointer' alignItems='center' gap='4'>
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
              <Image boxSize='50px' borderRadius='50%' src={author?.avatar} alt={author?.name} />
              <Text fontWeight='700'>by {author?.name}</Text>
            </Box>
          </Box>
        </Box>

        <Box className="" w='30%'>
          <Image w='full' h='310px' objectFit='cover' src={imageSrc} alt={title} />
        </Box>
      </Box>
    </Box>
  );
}

export default ItemCard;
