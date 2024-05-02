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
  <TabList borderBottomWidth='1px' py='5px' >
    <Tab>One</Tab>
    <Tab>Two</Tab>
    <Tab>Three</Tab>
  </TabList>
  <TabIndicator mt='-1.5px' height='2px' bg='black' borderRadius='1px' />
  <TabPanels mt='1rem'>
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
