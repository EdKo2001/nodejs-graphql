import { Request } from "express";
import { GraphQLError } from "graphql";
import jwt, { JwtPayload } from "jsonwebtoken";

import { User, db } from "../config";
import { env } from "../lib";

const jwtSecret = env.JWT_SECRET;

export interface Context {
  user: Partial<User> | null; // Allow user to be null for unauthenticated requests
}

const createContext = ({ req }: { req: Request }): Context => {
  const token = (req.header("Authorization") || "").replace(/Bearer\s?/, "");

  try {
    if (token) {
      const decoded = jwt.verify(token, jwtSecret) as JwtPayload;
      const user = db.users.get(decoded.userId);

      if (!user) {
        throw new GraphQLError("User is not found", {
          extensions: {
            code: "Unprocessable Entity",
            http: { status: 422 },
          },
        });
      }

      return {
        user,
      };
    }

    // For unauthenticated requests, return null for the user
    return {
      user: null,
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
