"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = __importDefault(require("zod"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const envSchema = zod_1.default.object({
    PORT: zod_1.default.any(),
    JWT_SECRET: zod_1.default.string().trim().min(1),
});
const env = envSchema.parse(process.env);
exports.default = env;
