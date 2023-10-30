import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import jwt from "jsonwebtoken";

import { checkAuth } from "./utils";

import db from "./config/db";

import { env } from "./lib";

const port = env.PORT || 9000;
const jwtSecret = env.JWT_SECRET;

const app = express();
app.use(cors(), bodyParser.json());

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

app.listen(port, () => console.info(`Server started on port ${port}`));
