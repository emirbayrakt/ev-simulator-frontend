import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: import.meta.env.VITE_GRAPHQL_API_URL,
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          simulations: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
});
