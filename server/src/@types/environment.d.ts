namespace NodeJS {
  interface ProcessEnv {
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_TOKEN: string;
    DISCORD_REDIRECT_URI: string;
    DISCORD_SESSION_SECRET: string;
    // NODE_ENV: 'development' | 'production';
    PORT?: string;
  }
}