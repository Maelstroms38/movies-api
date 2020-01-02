const { ApolloServer } = require("apollo-server");
const { ApolloGateway, RemoteGraphQLDataSource } = require("@apollo/gateway");

class AuthenticatedDataSource extends RemoteGraphQLDataSource {
  willSendRequest({ request, context }) {
    // pass the user's token from the context to underlying services
    // as a header called `Bearer ${token}`
    request.http.headers.set('Authorization', `Bearer ${context.token}`);
  }
}

const gateway = new ApolloGateway({
  serviceList: [
    { name: "movies", url: "https://graphql-gateway.herokuapp.com:4001/graphql" },
    { name: "posts", url: "https://graphql-gateway.herokuapp.com:4002/graphql" },
  ],
  buildService({ name, url }) {
    return new AuthenticatedDataSource({ url });
  },
});

(async () => {
  const { schema, executor } = await gateway.load();

  const server = new ApolloServer({ 
    schema, 
    executor,
    // Disable subscriptions (not currently supported with ApolloGateway)
    subscriptions: false,
    context: ({ req }) => {
      // get the user token from the headers
      const token = req.headers.authorization &&
                    req.headers.authorization.replace('Bearer ', '') || '';
      // try to retrieve the token
      // add the token to the context
      return { token };
    },
  });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
})();
