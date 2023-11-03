import fs from "fs";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { ApolloServerPluginLandingPageDisabled } from "@apollo/server/plugin/disabled";

import { createContext } from "../utils/index";
import { env } from ".";
import { resolvers } from "../config";

const typeDefs = fs.readFileSync("./config/schema.graphql", {
  encoding: "utf8",
});

const isProduction = process.env.NODE_ENV === "production";

async function startApolloServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: isProduction ? [ApolloServerPluginLandingPageDisabled()] : [],
  });

  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: env.APOLLO_PORT },
    context: createContext as any,
  });

  console.log(`🚀 Apollo Server is running on ${url}`);
  return apolloServer;
}

export default startApolloServer;
