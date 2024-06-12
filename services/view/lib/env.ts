import { z } from "zod";

const envSchema = z.object({
  HOST: z.string().min(1),
});

envSchema.parse(process.env);

export default process.env;

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
