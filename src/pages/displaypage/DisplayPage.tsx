
import { MainLayout } from ".."
import { useParams } from "react-router-dom";
import RenderPage from "./RenderPage";
import RenderPost from "./RenderPost";


const DisplayPage = ({ categoryData }: any) => {
  const { itemId } = useParams<{ itemId: string }>();
  // const { postId } = useParams<{ postId: string }>();

  
  return (
    <MainLayout>
       {/* <DisplayComp itemId={itemId || ''} /> */}
       {/* <RenderPage categoryData={categoryData} itemData={{ itemId: itemId || '' }} /> */}
       <RenderPost />

       <div className="">
        am heee
       </div>
    </MainLayout>
  );
}

export default DisplayPage
