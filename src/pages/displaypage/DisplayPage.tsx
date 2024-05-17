import { Box } from "@chakra-ui/react"
import { DisplayComp } from ".."
import { useParams } from "react-router-dom";
import { Footer, Header } from "../../components";


const DisplayPage = () => {
  const { itemId } = useParams<{ itemId: string }>();
  return (
    <Box>
      <Header />
       <DisplayComp itemId={itemId || ''} />
       <Footer />
    </Box>
  );
}

export default DisplayPage
