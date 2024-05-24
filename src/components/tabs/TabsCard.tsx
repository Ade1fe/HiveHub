import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react"
import { firestore, storage } from "../../firebase";
import Cards from "../cards/Cards";
import { Box, Tabs, TabList, TabPanel, TabPanels, Tab } from "@chakra-ui/react";
import { blogimg } from '../../assets';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from "firebase/storage";

interface Post {
    id: string;
    title: string;
    content: string;
    mediaPaths: string[];
    contentImage: string[];
    category: string;
    timeStamp: string;
    authorId: string;
    authorUsername: string;
    authorImage: string;
}

const TabsCard = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [groupedData, setGroupedData] = useState<{ [key: string]: Post[] }>({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const retrievePosts = query(collection(firestore, 'datainformation'), orderBy('timestamp', 'desc'));
                const retrievedPosts = await getDocs(retrievePosts);
                const postsArray: Post[] = await Promise.all(retrievedPosts.docs.map(async doc => {
                    const data = doc.data();
                    const timestamp = data.timestamp?.toDate();
                    const formattedTimestamp = timestamp ? timestamp.toLocaleString() : '';

                    const parser = new DOMParser();
                    const docContent = parser.parseFromString(data.content, 'text/html');
                    const mediaElements = Array.from(docContent.querySelectorAll('img, video'));
                    const mediaPaths = mediaElements.map(el => el.getAttribute("src")).filter(Boolean) as string[];

                    // const contentImage = mediaUrls.length > 0 ? mediaUrls : [blogimg];

                    // const mediaPaths = Array.isArray(data.mediaPaths) ? data.mediaPaths : [];

                    const mediaUrls = await Promise.all(mediaPaths.map(async (path: string) => {
                        try {
                            const url = await getDownloadURL(ref(storage, path));
                            return url;
                        } catch (error) {
                            console.error(`Error fetching media URL for path ${path}: `, error);
                            return blogimg; // Return default image on error
                        }
                    }));


                    console.log('Formatted Timestamp:', formattedTimestamp);
                    return {
                        id: doc.id,
                        title: data.title,
                        content: data.content,
                        category: data.category,
                        mediaPaths: mediaPaths,
                        contentImage: mediaUrls.length > 0 ? mediaUrls : [blogimg],
                        timeStamp: formattedTimestamp,
                        authorId: data.authorId,
                        authorUsername: data.username,
                        authorImage: data.authorImage ? data.authorImage : blogimg,
                    }
                }));
                setPosts(postsArray);
            }
            catch (err) {
                console.error('Error fetching posts: ', err);
            }
        }

        fetchPosts();
    }, []);



    useEffect(() => {
        const groupedData: { [key: string]: Post[]} = {};
        posts.forEach(post => {
            if (!groupedData[post.category]) {
                groupedData[post.category] = [];
            }
            groupedData[post.category].push(post)
        });
        setGroupedData(groupedData);
    }, [posts]);


    const handlePostClick = (postId: string) => {
        navigate(`/display/${postId}`); 
      };


    
  return (
    <Box>
        <Tabs>
            <TabList>
                {Object.keys(groupedData).map(category => (
                    <Tab key={category}>{category}</Tab>
                ))}
            </TabList>
            <TabPanels>
                {Object.keys(groupedData).map(category => (
                    <TabPanel key={category}>
                        <Cards posts={groupedData[category]} onItemClick={handlePostClick} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>
    </Box>
  )
}

export default TabsCard