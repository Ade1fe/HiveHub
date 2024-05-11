import React, { useEffect, useState } from 'react';
import { Box, Tab, TabIndicator, TabList, TabPanel, TabPanels, Tabs } from '@chakra-ui/react';

const TabContainer: React.FC = () => {
  const [tabContent, setTabContent] = useState<{ [key: number]: string }>({});
  const [activeTab, setActiveTab] = useState<number>(0);

  // Load content from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('savedData');
    if (savedData) {
      const parsedData: {
        content: string;
        titles: string[];
        subtitles: string[];
        titleColors: string[];
        subtitleColors: string[];
      } = JSON.parse(savedData);
      setTabContent({ 0: parsedData.content }); // Assuming content is for the first tab
    }
  }, []);

  // Save content to localStorage whenever it changes
  const saveContentToLocalStorage = (index: number, newContent: string) => {
    const savedData = {
      content: newContent,
      titles: [], // You might want to save titles and subtitles for each tab separately if needed
      subtitles: [],
      titleColors: [],
      subtitleColors: [],
      paragraphs: newContent.split('\n').map((line, index) => {
        return {
          id: `paragraph-${index}`,
          content: line
        };
      })
    };
    localStorage.setItem('savedData', JSON.stringify(savedData));
  };

  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  const handleContentChange = (index: number, content: string) => {
    setTabContent(prevContent => ({
      ...prevContent,
      [index]: content
    }));
    saveContentToLocalStorage(index, content);
  };

  return (
    <Box className="">
      <Tabs position='relative' variant='unstyled' index={activeTab} onChange={handleTabChange}>
        <TabList borderBottomWidth='1px' py='5px' bg='white' color='black' zIndex='99' position={['static', 'static', 'sticky']} top={['auto', 'auto', '0']} right={['auto', 'auto', '0']}>
          <Tab>Tab 1</Tab>
          <Tab>Tab 2</Tab>
          {/* Add more tabs as needed */}
        </TabList>
        <TabIndicator mt='-1.5px' height='2px' bg='black' borderRadius='1px' />
        <TabPanels mt='1rem' overflowY="auto" maxHeight="calc(100vh - 100px)">
          <TabPanel>
            {/* Render content from state within a div */}
            <div dangerouslySetInnerHTML={{ __html: tabContent[0] || '' }}></div>
          </TabPanel>
          <TabPanel>
            <div dangerouslySetInnerHTML={{ __html: tabContent[1] || '' }}></div>
          </TabPanel>
          {/* Add more TabPanels as needed */}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default TabContainer;
