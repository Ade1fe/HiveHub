// TabContainer component
import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { ItemCard } from '..';
import { firestore } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { blogimg } from '../../assets';
import { useNavigate } from 'react-router-dom';

const TabContainer: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datainformation = collection(firestore, 'datainformation');
        const querySnapshot = await getDocs(datainformation);
        const fetchedData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          const formattedDate = data.timestamp.toDate().toLocaleString();
          const title = data.titles ? data.titles[0] : 'Title'; 
          const imageSrc = data.images ? data.images[0] : blogimg; 
          const description = data.content.replace(/\[(.*?)\]/g, '').trim();
          console.log('dat', data)
          return {
            id: doc.id,
            category: data.categories || 'hive-hub',
            date: formattedDate,
            title: title,
            description: description || 'No description',
            author: data.author || { name: 'Micheell Crige', avatar: 'https://cdn.dribbble.com/users/699610/avatars/normal/607c294005d360e5f351832033bad05f.png?1699393852' },
            imageSrc: imageSrc,
          };
        });
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (itemId: string) => {
    navigate(`/display/${itemId}`); 
    console.log("itemId",itemId);
  };
  

  return (
    <Box className="">
      <Box display="flex" flexDirection="column">
        {data.map((item, index) => (
          <ItemCard
            key={index}
            itemcardId={item.id} 
            category={item.category}
            date={item.date}
            title={item.title}
            description={item.description}
            author={item.author}
            imageSrc={item.imageSrc}
            onItemClick={() => handleItemClick(item.id)} // Pass the handleItemClick function as a prop
          />
        ))}
      </Box>
    </Box>
  );
};

export default TabContainer;