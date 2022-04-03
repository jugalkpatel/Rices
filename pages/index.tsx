import type { NextPage } from "next";
import { gql, useQuery } from "@apollo/client";

const IS_LOGGED_IN = gql`
  query getIsLoggedIn {
    isLoggedIn @client
    id @client
    name @client
  }
`;

const Home: NextPage = () => {
  const { data, loading, error } = useQuery(IS_LOGGED_IN);

  console.log({ data });

  if (loading) {
    return <h1>Loading....</h1>;
  }

  if (data) {
    return <pre>{JSON.stringify(data, null, 2)}</pre>;
  }

  return <h1>Something went wrong</h1>;
};

export default Home;
