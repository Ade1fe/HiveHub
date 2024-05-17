
import React, { useEffect, useState } from 'react';
import { Box, Tab, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'; // Import Tabs component
import { ItemCard } from '..';
import { firestore } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { blogimg } from '../../assets';
import { useNavigate } from 'react-router-dom';

const TabContainer: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
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
        if (fetchedData.length > 0) {
          setSelectedCategory(fetchedData[0].category);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleItemClick = (itemId: string) => {
    navigate(`/display/${itemId}`); 
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const groupedData: { [key: string]: any[] } = {};
  data.forEach(item => {
    if (!groupedData[item.category]) {
      groupedData[item.category] = [];
    }
    groupedData[item.category].push(item);
  });

  return (
   <Box className="">
     <Tabs> 
      <TabList shadow='sm'>
        {Object.keys(groupedData).map(category => (
          <Tab
            key={category}
            onClick={() => handleCategoryChange(category)}
            _selected={selectedCategory === category ? { color: 'blue.500', borderBottomWidth: "2px" , borderBottomColor: "blue.500" } : undefined}
          >
            {category}
          </Tab>
        ))}
      </TabList>
  
      <TabPanels>
        {Object.keys(groupedData).map(category => (
          <TabPanel key={category}>
            {groupedData[category].map((item, index) => (
              <ItemCard
                key={index}
                itemcardId={item.id} 
                category={item.category}
                date={item.date}
                title={item.title}
                description={item.description}
                author={item.author}
                imageSrc={item.imageSrc}
                onItemClick={() => handleItemClick(item.id)}
              />
            ))}
          </TabPanel>
        ))}
      </TabPanels>
    </Tabs>
   </Box>
  );
};

export default TabContainer;











