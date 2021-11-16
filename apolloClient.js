import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: "https://api-us-west-2.graphcms.com/v2/ckvsnkzsv140s01xs1o3mf46e/master",
  cache: new InMemoryCache(),
});

export default client;
