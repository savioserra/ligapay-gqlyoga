import { GraphQLServer } from "graphql-yoga";
import { Prisma } from "./prisma";
import { typeDefs } from "./typeDefs";

import { permissions } from "./permissions";
import resolvers from "./resolvers";
import { appSecret } from "./utils";

const prismaEndpoint = `${process.env.PRISMA_SERVER_ENDPOINT}/${process.env.APP_NAME}/${process.env.STAGE}`;

const port = process.env.PORT || 4000;
const debug = process.env.DEBUG === "true";
const tracing = process.env.TRACING === "true";

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  // middlewares: [permissions],
  context: req => ({
    ...req,
    prisma: new Prisma({
      endpoint: prismaEndpoint,
      secret: appSecret,
      debug
    })
  })
});

// tslint:disable-next-line: no-console
server.start({ port, tracing }, () => console.log(`Server is running!`));
