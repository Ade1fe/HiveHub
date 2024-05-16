

import React, { useEffect, useState } from 'react';
import { Box } from '@chakra-ui/react';
import { firestore } from '../../firebase'; // Import firestore
import { doc, getDoc } from 'firebase/firestore';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../firebase'; // Import storage from firebase

interface DisplayPageProps {
  itemId: string; // Receive itemId as a prop
}

const DisplayComp: React.FC<DisplayPageProps> = ({ itemId }) => {
  const [itemData, setItemData] = useState<any | null>(null);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const itemRef = doc(firestore, 'datainformation', itemId);
        const itemSnap = await getDoc(itemRef);
        if (itemSnap.exists()) {
          const data = itemSnap.data();
          setItemData(data);
          // Fetch images
          if (data.images && data.images.length > 0) {
            const urls = await Promise.all(
              data.images.map(async (imageName: string) => {
                const imageRef = ref(storage, imageName);
                return getDownloadURL(imageRef);
              })
            );
            setImageUrls(urls);
          }
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [itemId]); // Fetch data when itemId changes

  return (
    <Box>
      {/* Display fetched data */}
      {itemData ? (
        <>
          {/* Render titles */}
          {itemData.titles && itemData.titles.map((title: string, index: number) => (
            <h2 key={index}>{title}</h2>
          ))}
          {/* Render subtitles */}
          {itemData.subtitles && itemData.subtitles.map((subtitle: string, index: number) => (
            <h3 key={index}>{subtitle}</h3>
          ))}
          {/* Render content */}
          <p>{itemData.content}</p>
          {/* Render images */}
          {imageUrls.map((imageUrl: string, index: number) => (
            <img key={index} src={imageUrl} alt={`Image ${index}`} />
          ))}
          {/* Add other fields you want to display */}
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Box>
  );
};

export default DisplayComp;
