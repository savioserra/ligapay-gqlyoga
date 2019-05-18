import { GraphQLServer } from "graphql-yoga";
import { Prisma } from "./prisma";
import { typeDefs } from "./typeDefs";

import resolvers from "./resolvers";

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context: req => ({
    ...req,
    prisma: new Prisma({
      endpoint: "http://prisma:4466/ligapay",
      debug: true
    })
  })
});

// tslint:disable-next-line: no-console
server.start(() => console.log("Server is running on http://localhost:4000"));
