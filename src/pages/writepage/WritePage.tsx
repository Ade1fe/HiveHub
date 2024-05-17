import { Box } from "@chakra-ui/react";
import { WriteComp } from "..";
import { Footer, Header } from "../../components";


const WritePage: React.FC = () => {
  

  return (
    <Box>
      <Header />
      <WriteComp />
      <Footer />
    
    </Box>
  );
}

export default WritePage;
