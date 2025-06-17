// React Components
import React from "react";
// Components
import LoadMore from "../../Components/LoadMore/LoadMore";
import Search from "../../Components/Search/Search";
import SignIn from "../../Components/SignIn/SignIn";
const Home = () => {
  // useEffect(() => {
  //   const fetchBlogPosts = async () => {
  //     const response = await axios.get(`/blogPosts?page=${page}&limit=10`);
  //     setBlogPosts((prevPosts) => [...prevPosts, ...response.data.blogPosts]);
  //     setTotalPages(response.data.totalPages);
  //   };

  //   fetchBlogPosts();
  // }, [page]);
  return (
    <>
      <SignIn noDelay={false} />
      <Search />
      <LoadMore />
    </>
  );
};

export default Home;
