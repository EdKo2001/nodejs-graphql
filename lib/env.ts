import zod from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = zod.object({
  PORT: zod.union([zod.string(), zod.number()]),
  JWT_SECRET: zod.string().trim().min(1),
});

const env = envSchema.parse(process.env);

export default env;
