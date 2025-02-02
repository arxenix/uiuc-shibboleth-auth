/**
 * @description In-memory storage for the bot.
 */

export interface StorageProvider {
  setData(key: string, value: unknown, ttlSeconds?: number): Promise<void>;
  getData<T>(key: string): Promise<T>;
  deleteData(key: string): Promise<void>;
}

export interface DiscordData {
  access_token: string;
  access_token_expires_in: number;
  refresh_token: string;
}

const store = new Map();

export async function storeDiscordTokens(userId: string, tokens: DiscordData) {
  await store.set(`discord-${userId}`, tokens);
}

export async function getDiscordTokens(userId: string): Promise<DiscordData> {
  return store.get(`discord-${userId}`);
}