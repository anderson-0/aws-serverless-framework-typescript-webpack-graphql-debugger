import { APIGatewayEvent, APIGatewayProxyEvent, Callback, Context, Handler } from 'aws-lambda';
import { ApolloService } from './services/apollo.service';
import { handlers, middleware, startServerAndCreateLambdaHandler } from '@as-integrations/aws-lambda';

const server = new ApolloService().server;
const requestHandler = handlers.createAPIGatewayProxyEventV2RequestHandler();

// const cookieMiddleware: middleware.MiddlewareFn<typeof requestHandler> = async (
//   event,
// ) => {
//   const cookie = event.headers.cookie
//   if (cookie) {
//     event.headers['Cookie'] = cookie
//   }
//   return event
// }

export const graphQLHandler: Handler = (
  event: APIGatewayProxyEvent,
  context: Context,
  callback: Callback
) => {
  context.callbackWaitsForEmptyEventLoop = false

  // Duplicating content-type for multipart/form-data handling
  if (Object.keys(event.headers).includes('Content-Type')) {
    event.headers['content-type'] = event.headers['Content-Type']
  }

  if (
    event.isBase64Encoded &&
    event.body &&
    event.headers['content-type']?.includes('multipart/form-data')
  ) {
    event = {
      ...event,
      body: Buffer.from(event.body, 'base64').toString('binary'),
      isBase64Encoded: false
    }
  }

  try {
    
    // This final export is important!
    const graphqlHandler = startServerAndCreateLambdaHandler(server, requestHandler, {
      context: async ({ event, context }) => {
        return {
          lambdaEvent: event,
          lambdaContext: context,
        };
      },
      middleware: [
        // cookieMiddleware
      ],
    });

    return graphqlHandler
    // const gQLHandler = apolloService.server.createHandler({
    //   expressGetMiddlewareOptions: {
    //     cors: {
    //       origin: '*',
    //       credentials: true
    //     }
    //   }
    // })
    // return gQLHandler(event, context, callback)
  } catch (error) {
    // return ApiResponseBuilder.failure(error, callback)
  }
};