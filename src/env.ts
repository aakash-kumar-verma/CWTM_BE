import "dotenv/config";
import z from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  JWT_SECRET: z.string(),
  MONGO_URL: z.string().url(),
  JWT_EXPIRES_IN: z.string(),
});

const parsed = envSchema.safeParse(process.env);
console.log({ parsed });

if (!parsed.success) {
  console.log(parsed.error.flatten().fieldErrors);
  process.exit();
}

export const env = parsed.data;
