import React, { useEffect, useState } from 'react';
import { Box , Image, Text} from '@chakra-ui/react';
import { firestore } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import RenderPage from './RenderPage'; // Import RenderPage component
import { blogimg } from '../../assets';

interface DisplayPageProps {
  itemId: string; // Receive itemId as a prop
}

const DisplayComp: React.FC<DisplayPageProps> = ({ itemId }) => {
  const [categoryData, setCategoryData] = useState<any>(null); 
  const [timestamp, setTimestamp] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const documentRef = doc(firestore, 'datainformation', itemId);
        const docSnapshot = await getDoc(documentRef);
        if (docSnapshot.exists()) {
          const data = docSnapshot.data();
          setCategoryData(data); 
          console.log("data", data);
          if (data.timestamp) {
            // Parse the timestamp into a Date object
            const parsedTimestamp = new Date(data.timestamp.seconds * 1000); // Firebase timestamp is in seconds
            setTimestamp(parsedTimestamp);
          } else {
            setTimestamp(null);
          }
        } else {
          console.log('Document does not exist');
        }
      } catch (error) {
        console.error('Error fetching document:', error);
      }
    };

    fetchData();
  }, [itemId]);

  return (
    <Box p={4}>
     <div className="">
        <Text>{timestamp?.toLocaleString() || ""}</Text>
        <Image boxSize='80px' borderRadius='50%' src={blogimg} />
        <Text>Oluwadamisi Damilola</Text>
        <Text>Follow</Text>
     </div>
      {/* {categoryData && <RenderPage categoryData={categoryData} />} */}
    </Box>
  );
};

export default DisplayComp;
