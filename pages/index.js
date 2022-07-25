import Axios from "axios";

const Home = (props) => {
  const posts = props.data;

  console.log(posts);
  return (
    <div>
      <h1>Home</h1>
      <p>
        {posts.alive? "API online" : "API offline"}
      </p>
    </div>
  );
};

export default Home;

export const getStaticProps = async () => {
  const res = await Axios.get("https://doar-computador-api.herokuapp.com");
  console.log(res);
  return {
    props: { data: res.data },
  };
};