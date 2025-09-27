import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react"
import { firestore, storage } from "../../firebase";
import Cards from "../cards/Cards";
import { Box, Tabs, TabList, TabPanel, TabPanels, Tab, Flex } from "@chakra-ui/react";
import { blogimg } from '../../assets';
import { useNavigate } from 'react-router-dom';
import { ref, getDownloadURL } from "firebase/storage";
import { toast } from "sonner";
import Toast from "../../toast/Toast";

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

type GroupedData = { [key: string]: Post[] };

const TabsCard = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [groupedData, setGroupedData] = useState<GroupedData>({});
    const [tabCategories, setTabCategories] = useState<string[]>([]);
    const navigate = useNavigate();


    //   CONFIGURING TOAST TO TOAST MESSAGE
    const showToastMessage = useCallback((message: any, type: 'success' | 'error' | 'warning') => {
        switch (type) {
            case 'success':
                toast.success(message, {
                    position: 'top-right',
                    duration: 3000,
                });
                break;
            case 'error':
                toast.error(message, {
                    position: 'top-right',
                    duration: 3000,
                });
                break;
            case 'warning':
                toast.warning(message, {
                    position: 'top-right',
                    duration: 3000,
                });
                break;
            default:
                break;
        }
    }, []);



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
                    const firstImageSrc = docContent.querySelector('img')?.getAttribute("src") || '';
                    const mediaElements = Array.from(docContent.querySelectorAll('img, video'));
                    const mediaPaths = mediaElements.map(el => el.getAttribute("src")).filter(Boolean) as string[];

                    // const contentImage = mediaUrls.length > 0 ? mediaUrls : [blogimg];

                    // const mediaPaths = Array.isArray(data.mediaPaths) ? data.mediaPaths : [];
                    // @ts-ignore
                    const mediaUrls = await Promise.all(mediaPaths.map(async (path: string) => {
                        try {
                            const url = await getDownloadURL(ref(storage, path));
                            return url;
                        } catch (error) {
                            // showToastMessage(`Error fetching media URL for path ${path}`, 'error');
                            return blogimg; // Return default image on error
                        }
                    }));


                    return {
                        id: doc.id,
                        title: data.title || 'No Title',
                        content: data.content || '',
                        category: data.category || 'Uncategorized',
                        mediaPaths: mediaPaths,
                        contentImage: firstImageSrc ? [firstImageSrc] : [blogimg],
                        timeStamp: formattedTimestamp,
                        authorId: data.authorId || '',
                        authorUsername: data.username || 'Anonymous',
                        authorImage: data.authorImage ? data.authorImage : blogimg,
                    }
                }));
                postsArray.sort((a, b) => new Date(b.timeStamp).getTime() - new Date(a.timeStamp).getTime());
                setPosts(postsArray);
            }
            catch (err) {
                console.error(err);
                showToastMessage('Error fetching posts: ', 'error');
            }
        }

        fetchPosts();
    }, [showToastMessage]);



    useEffect(() => {
        const groupedData: GroupedData = {};
        const categories: string[] = [];

        posts.forEach(post => {
            const category = post?.category?.trim() || 'Uncategorized'; 

            if (!groupedData[post.category]) {
                groupedData[post.category] = [];
                categories.push(category);
            }
            groupedData[post.category].push(post)
        });
        const allPostsCategory = 'All Posts';

        if (posts.length > 0) {
            groupedData[allPostsCategory] = posts;
            categories.unshift(allPostsCategory); 
        }

        setGroupedData(groupedData);
        setTabCategories(categories);
    }, [posts]);


    const handlePostClick = (postId: string) => {
        navigate(`/display/${postId}`); 
    };








    
  return (
    <Box w='full' px={[2, 4]} maxW="5xl" mx="auto" py={6}>
        <Tabs variant='soft-rounded' colorScheme='blue'>
            <Flex overflowX="auto" sx={{ '&::-webkit-scrollbar': { display: 'none' }, msOverflowStyle: 'none', scrollbarWidth: 'none', }} >    
                <TabList mb='6' bg='gray.50' borderRadius='lg' p='2' flexWrap='wrap'>
                    {tabCategories.map(category => (
                        <Tab key={category} _selected={{ color: 'white', bg: 'blue.500' }} whiteSpace="nowrap" mr={2} >{category}</Tab>
                    ))}
                </TabList>
            </Flex>
            <TabPanels>
                {tabCategories?.map(category => (
                    <TabPanel key={category} p='0'>
                        <Cards posts={groupedData[category]} onItemClick={handlePostClick} />
                    </TabPanel>
                ))}
            </TabPanels>
        </Tabs>

        <Toast showToast={showToastMessage} />
    </Box>
  )
}

export default TabsCard