import { Box, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react'
import { blogimg } from '../../assets';
import { ItemCard } from '..';

const TabContainer = () => {

    const post = {
        category: "Design",
        date: "29 Jun 2021",
        title: "Our new Design",
        description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga saepe excepturi soluta, velit corporis nobis inventore facere est molestiae similique eligendi doloremque cum, sit labore, dignissimos reiciendis eveniet autem eum.",
        author: {
          name: "Micheell Crige",
          avatar: "https://cdn.dribbble.com/users/699610/avatars/normal/607c294005d360e5f351832033bad05f.png?1699393852"
        },
        imageSrc: blogimg
      };

      
  return (
    <Box className="" >

    <Tabs position='relative' variant='unstyled' >
  <TabList borderBottomWidth='1px' py='5px' bg='white' color='black'  zIndex='99' position={['static', 'static', 'sticky']} top={['auto', 'auto', '0']} right={['auto', 'auto', '0']}>
    <Tab>One</Tab>
    <Tab>Two</Tab>
    <Tab>Three</Tab>
  </TabList>
  <TabIndicator mt='-1.5px' height='2px' bg='black' borderRadius='1px' />
  <TabPanels mt='1rem'  overflowY="auto" maxHeight="calc(100vh )">
    <TabPanel>
    <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
      <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
      <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />

      <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
      <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
      <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
      <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
      
    </TabPanel>
    <TabPanel>
    <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
    </TabPanel>
    <TabPanel>
    <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
    </TabPanel>
  </TabPanels>
</Tabs>

    </Box>
  )
}

export default TabContainer






























import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react'; // Import Box from Chakra UI
import { ItemCard } from '..'; // Import your ItemCard component here
import { firestore } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';
import { blogimg } from '../../assets';

const TabContainer: React.FC = () => {
  const [data, setData] = useState<any[]>([]); // Define state to store fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const datainformation = collection(firestore, 'datainformation');
        const querySnapshot = await getDocs(datainformation);
        const fetchedData = querySnapshot.docs.map(doc => {
          const data = doc.data();
          // Format the date to a string
          const formattedDate = data.timestamp.toDate().toLocaleString(); // Example formatting
          // Check if imageSrc exists, otherwise use default image
          const imageSrc = data.imageSrc ? data.imageSrc : blogimg;
          // Extract description from content excluding parts in square brackets
          const description = data.content.replace(/\[(.*?)\]/g, '').trim();
          // Map specific fields to match the props required by ItemCard
          return {
            id: doc.id, // Add document ID to the item
            category: data.category || 'hive-hub', // Default category if not exists
            date: formattedDate,
            title: data.titles || 'Title', // Default title if not exists
            description: description || 'No description', // Default description if not exists
            author: data.author || { name: 'Micheell Crige', avatar: 'https://cdn.dribbble.com/users/699610/avatars/normal/607c294005d360e5f351832033bad05f.png?1699393852' }, // Default author if not exists
            imageSrc: imageSrc, // Assign imageSrc
          };
        });
        setData(fetchedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

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
          />
        ))}
      </Box>
    </Box>
  );
};

export default TabContainer;
