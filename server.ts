import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import fs from "fs";

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { checkAuth } from "./utils";

import { db, resolvers } from "./config";

import { env } from "./lib";

const port = env.PORT || 9000;
const jwtSecret = env.JWT_SECRET;

const app = express();
app.use(cors(), bodyParser.json());

const typeDefs = fs.readFileSync("./config/schema.graphql", {
  encoding: "utf8",
});

async function startServer() {
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(apolloServer, {
    listen: { port: env.APOLLO_PORT, path: "/graphql" },
  });

  console.log(`🚀  Apollo Server ready at: ${url}`);

  app.post("/login", (req, res) => {
    const { email, password } = req.body;

    const user = db.users.list().find((user) => user.email === email);

    if (!(user && user.password === password)) {
      res.sendStatus(401);
      return;
    }

    const token = jwt.sign({ userId: user.id }, jwtSecret);

    res.send({ token });
  });

  // Protect routes that require authentication
  app.get("/protected", checkAuth, (req, res) => {
    res.send("Protected route - JWT authentication successful!");
  });

  // Error handling middleware
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  });

  app.listen(port, () =>
    console.info(`Express Server started on port ${port}`)
  );
}

startServer();
