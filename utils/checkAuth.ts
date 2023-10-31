import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../lib";

const jwtSecret = env.JWT_SECRET;

const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = (req.header("Authorization") || "").replace(/Bearer\s?/, "");

  if (!token) {
    res.sendStatus(401);
    return;
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.user = {};
    req.user.id = decoded.userId;

    next();
  } catch (e) {
    res.sendStatus(403);
    return;
  }
};

export default checkAuth;
