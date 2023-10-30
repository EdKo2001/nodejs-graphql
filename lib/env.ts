import zod from "zod";
import dotenv from "dotenv";

dotenv.config();

const envSchema = zod.object({
  PORT: zod
    .string()
    .min(1)
    .transform((value) => parseInt(value)),
  APOLLO_PORT: zod
    .string()
    .min(1)
    .transform((value) => parseInt(value)),
  JWT_SECRET: zod.string().trim().min(1),
});

const env = envSchema.parse(process.env);

export default env;
