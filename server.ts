import bodyParser from "body-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

import { checkAuth } from "./utils";

import { db } from "./config";

import { env, startApolloServer } from "./lib";

const port = env.PORT || 9000;
const jwtSecret = env.JWT_SECRET;

const app = express();
app.use(cors(), bodyParser.json());

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;

  const user = db.users.list().find((user) => user.email === email);

  if (!(user && user.password === password)) {
    return res.status(422).json({
      message: "User is not found",
    });
  }

  const token = jwt.sign({ userId: user.id }, jwtSecret);

  res.send({ token });
});

// Protect routes that require authentication
app.get("/api/protected", checkAuth, (req, res) => {
  res.send("Protected route - JWT authentication successful!");
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

startApolloServer();
app.listen(port, () =>
  console.info(`🚀 Express Server is running on http://localhost:${port}`)
);
