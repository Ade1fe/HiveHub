import { Box } from '@chakra-ui/react'
import { ItemCard } from '../../components'
import { blogimg } from '../../assets';



const Homepage = () => {

  const post = {
    category: "Design",
    date: "29 Jun 2021",
    title: "Our new Design",
    description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Fuga saepe excepturi soluta, velit corporis nobis inventore facere est molestiae similique eligendi doloremque cum, sit labore, dignissimos reiciendis eveniet autem eum.",
    author: {
      name: "Micheell Crige",
      avatar: "https://cdn.dribbble.com/users/699610/avatars/normal/607c294005d360e5f351832033bad05f.png?1699393852"
    },
    imageSrc: blogimg
  };


  return (
    <Box>
      hello world
        <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
          <ItemCard 
        category={post.category}
        date={post.date}
        title={post.title}
        description={post.description}
        author={post.author}
        imageSrc={post.imageSrc}
      />
    </Box>
  )
}

export default Homepage
