import React, { useState } from "react";
import { Box, Text, Button, Image } from "@chakra-ui/react";

const AdvertContainer = () => {
  const [showAdvert, setShowAdvert] = useState(true);

  const handleClose = () => {
    setShowAdvert(false);
  };

  return (
    <>
      {showAdvert && (
        <Box bg="#f1f1f1" pos='relative' p="4" borderRadius="md" boxShadow="md" textAlign="center" display={['flex']} alignItems='center' justifyContent='center' gap='0'>
          <Text fontSize="xs" fontWeight="bold"transform="rotate(-90deg)" color='gray.700'>
            Advertisement
          </Text>
          <Box >
            <Image src="https://tpc.googlesyndication.com/simgad/8782631673192659501" alt="Advertisement" />
          </Box>
          <Text fontSize="xs" fontWeight="bold"transform="rotate(-90deg)" color='gray.700'>
            Advertisement
          </Text>
          <Button mt="4" variant="outline" onClick={handleClose} pos={['relative']} top='-10' left='20'>
            x
          </Button>
        </Box>
      )}
    </>
  );
};

export default AdvertContainer;
