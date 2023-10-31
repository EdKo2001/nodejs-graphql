// context.ts

import { Request } from "express";
import { GraphQLError } from "graphql";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User } from "../config";

import { env } from "../lib";

const jwtSecret = env.JWT_SECRET;

export interface Context {
  user: Partial<User>;
}

const createContext = ({ req }: { req: Request }): Context => {
  const token = (req.header("Authorization") || "").replace(/Bearer\s?/, "");

  if (!token) {
    throw new GraphQLError("User is not authenticated", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    const user = { id: decoded.userId };

    return {
      user,
    };
  } catch (e) {
    throw new GraphQLError("Forbidden", {
      extensions: {
        code: "Forbidden",
        http: { status: 403 },
      },
    });
  }
};

export default createContext;
