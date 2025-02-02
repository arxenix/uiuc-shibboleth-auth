import dotenv from 'dotenv';

/**
 * Load environment variables
 */

dotenv.config();

const config = {
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID!,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET!,
  DISCORD_TOKEN: process.env.DISCORD_TOKEN!,
  DISCORD_REDIRECT_URI: process.env.DISCORD_REDIRECT_URI!,
  DISCORD_SESSION_SECRET: process.env.DISCORD_SESSION_SECRET!,
  JWT_SECRET: process.env.JWT_SECRET!,
  PORT: process.env.PORT || '3000',
};

type Config = Required<typeof config>;

// Validate config
const validateConfig = (config: Config) => {
  for (const key of Object.keys(config) as Array<keyof Config>) {
    if (!config[key]) {
      throw new Error(`Missing ${key}`);
    }
  }
};

validateConfig(config);

export default config as Config;
