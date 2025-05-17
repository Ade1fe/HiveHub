import { useState } from "react";
import { Box, Text, Image, IconButton } from "@chakra-ui/react";
import { IoCloseOutline } from "react-icons/io5";

const AdvertContainer = () => {
  const [showAdvert, setShowAdvert] = useState(true);

  const handleClose = () => {
    setShowAdvert(false);
  };

  return (
    <>
      {showAdvert && (
        <Box bg="#f1f1f1" pos='relative' top='0' zIndex='sticky' p={[2, 4]} borderRadius="md" boxShadow="md" textAlign="center" display='flex' flexDirection={["column", "row"]} alignItems='center' justifyContent='center' gap={[2, 4]} mx="auto" my={4} maxW="1340px" overflow="hidden">
          <Text fontSize="xs" fontWeight="bold" transform={["none", "rotate(-90deg)"]} whiteSpace="nowrap" order={[1, 0]} color='gray.700'> Advertisement</Text>
          <Box >
            <Image src="https://tpc.googlesyndication.com/simgad/8782631673192659501" alt="Advertisement" loading='lazy' />
          </Box>
          <Text fontSize="xs" fontWeight="bold" transform={["none", "rotate(-90deg)"]} whiteSpace="nowrap" display={["none", "block"]} color='gray.700'> Advertisement</Text>
          <IconButton aria-label="Close advertisement" icon={<IoCloseOutline />} onClick={handleClose} position="absolute" top={[14, 4]} right={[1, 4]} size="sm" variant="ghost" borderRadius="full" />
        </Box>
      )}
    </>
  );
};

export default AdvertContainer;
