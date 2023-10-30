"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const lib_1 = require("../lib");
const jwtSecret = lib_1.env.JWT_SECRET;
const authenticateJWT = (req, res, next) => {
    const token = req.header("Authorization");
    if (!token) {
        res.sendStatus(401);
        return;
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, jwtSecret);
        req.user = {};
        req.user.id = decoded.userId;
        next();
    }
    catch (e) {
        res.sendStatus(403);
        return;
    }
};
exports.default = authenticateJWT;
