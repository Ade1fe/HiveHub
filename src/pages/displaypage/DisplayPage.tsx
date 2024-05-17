
import { DisplayComp, MainLayout } from ".."
import { useParams } from "react-router-dom";


const DisplayPage = () => {
  const { itemId } = useParams<{ itemId: string }>();

  
  return (
    <MainLayout>
       <DisplayComp itemId={itemId || ''} />
    </MainLayout>
  );
}

export default DisplayPage
