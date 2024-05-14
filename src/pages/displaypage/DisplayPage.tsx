import { Box } from "@chakra-ui/react"
import { DisplayComp } from ".."
import { useParams } from "react-router-dom";


const DisplayPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  return (
    <Box>
       <DisplayComp itemId={itemId || ''} />
    </Box>
  );
}

export default DisplayPage
