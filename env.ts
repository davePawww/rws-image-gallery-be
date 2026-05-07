import { z } from "zod";
import { configDotenv as loadEnv } from "dotenv";

// Determine application stage
process.env.APP_STAGE = process.env.APP_STAGE || "dev";

const isProduction = process.env.APP_STAGE === "production";
const isDevelopment = process.env.APP_STAGE === "dev";
const isTesting = process.env.APP_STAGE === "test";

// Load .env files based on environment
if (isDevelopment) {
  loadEnv(); // Loads .env
} else if (isTesting) {
  loadEnv({ path: ".env.test" }); // Loads .env.test
}

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  APP_STAGE: z.enum(["dev", "production", "test"]).default("dev"),

  // Server Configuration
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default("localhost"),

  // CORS Configuration
  CORS_ORIGIN: z
    .string()
    .or(z.array(z.string()))
    .transform((val) => {
      if (typeof val === "string") {
        return val.split(",").map((origin) => origin.trim());
      }
      return val;
    })
    .default([]),

  // Logging Configuration
  LOG_LEVEL: z
    .enum(["error", "warn", "info", "debug", "trace"])
    .default(isProduction ? "info" : "debug"),
});

// Type inference from schema
export type Env = z.infer<typeof envSchema>;
let env: Env;

try {
  env = envSchema.parse(process.env);
} catch (error) {
  if (error instanceof z.ZodError) {
    console.error("❌ Invalid environment variables:");
    console.error(z.treeifyError(error)); // Print the error in a tree format

    // Detailed error messages
    error.issues.forEach((issue) => {
      const path = issue.path.length ? issue.path.join(".") : "(root)";
      console.error(`  ${path}: ${issue.message}`);
    });

    process.exit(1); // Exit with error code
  }
  throw error;
}

// Helper functions for environment checks
export const isProd = () => env.NODE_ENV === "production";
export const isDev = () => env.NODE_ENV === "development";
export const isTest = () => env.NODE_ENV === "test";

// Export the validated environment
export { env };
export default env;
