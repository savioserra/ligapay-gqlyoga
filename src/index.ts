// tslint:disable no-console

import { GraphQLServer } from "graphql-yoga";
import { Prisma } from "./prisma";
import { typeDefs } from "./typeDefs";

import { permissions } from "./permissions";
import resolvers from "./resolvers";
import { appSecret } from "./utils";

import logger from "./middlewares/logger";

const prismaEndpoint = `${process.env.PRISMA_SERVER_ENDPOINT}/${process.env.APP_NAME}/${process.env.STAGE}`;

const port = process.env.PORT || 4000;
const debug = process.env.DEBUG === "true";
const tracing = process.env.TRACING === "true";

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  middlewares: [logger, permissions],
  context: req => ({
    ...req,
    prisma: new Prisma({
      endpoint: prismaEndpoint,
      secret: appSecret,
      debug
    })
  })
});

server.start({ port, deduplicator: true, tracing }, () => console.log(`Server is running!`));
