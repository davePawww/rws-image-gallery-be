import { z } from "zod";
import { configDotenv as loadEnv } from "dotenv";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

// Helper functions for environment checks
export const isProd = () => process.env.NODE_ENV === "production";
export const isDev = () => process.env.NODE_ENV === "development";
export const isTest = () => process.env.NODE_ENV === "test";

// Load .env files based on environment
if (isDev()) {
  loadEnv(); // Loads .env
} else if (isTest()) {
  loadEnv({ path: ".env.test" }); // Loads .env.test
}

const envSchema = z.object({
  // Node Environment
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),

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
    .default(isProd() ? "info" : "debug"),
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

// Export the validated environment
export { env };
export default env;
