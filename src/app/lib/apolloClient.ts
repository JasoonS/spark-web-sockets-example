import { ApolloClient, InMemoryCache, HttpLink, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities';

// Replace these URIs with your own
const httpUri = 'https://indexer.staging.bigdevenergy.link/89a1985/v1/graphql';
const wsUri = 'wss://indexer.bigdevenergy.link/029c37c/v1/graphql';

const httpLink = new HttpLink({
  uri: httpUri,
});

const wsLink = new WebSocketLink({
  uri: wsUri,
  options: {
    reconnect: true,
  },
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

export default client;
