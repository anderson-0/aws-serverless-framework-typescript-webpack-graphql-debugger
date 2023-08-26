import { ApolloServer } from '@apollo/server';
import { startServerAndCreateLambdaHandler, handlers, } from '@as-integrations/aws-lambda';
import { APIGatewayEvent, Context } from 'aws-lambda';
import { GraphQLError } from 'graphql';


// throw new GraphQLError("my message", {
//   extensions: {
//     code: 'UNAUTHENTICATED'
//   },
// });

interface ApolloServerContext {
  event: APIGatewayEvent
  context: Context
}

export class ApolloService {
  public server: ApolloServer

  constructor() {
    this.server = this.generateApollo()
  }

  private generateApollo(): ApolloServer {
    // The GraphQL schema
    const typeDefs = `#graphql
      type Query {
        hello: String
      }
    `;

    // A map of functions which return data for the schema.
    const resolvers = {
      Query: {
        hello: () => 'world',
      },
    };

    // Set up Apollo Server
    const server = new ApolloServer({
      typeDefs,
      resolvers,
    });
    

    return server
  }
}