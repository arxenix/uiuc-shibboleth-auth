import crypto from 'crypto';

import config from '../../config.js';
import * as storage from '../../storage.js';

/**
 * Code specific to communicating with the Discord API.
 *
 * The following methods all facilitate OAuth2 communication with Discord.
 * See https://discord.com/developers/docs/topics/oauth2 for more details.
 */

const PLATFORM_NAME = "UIUC Shibboleth Connection"
const API_ENDPOINT = "https://discord.com/api/v10"

// TODO
export interface ConnectionMetadataSchema {
  key: string;
  name: string;
  description: string;
  type: number;
}

// TODO: Generate ConnectionMetadata types 1-7 from instance of ConnectionMetadataSchema

export interface OAuth2TokenResponse {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
  token_type: string;
}

export interface OAuth2UserInfo {
  application: {
    id: string;
    name: string;
    icon: string | null;
    description: string;
    summary: string;
    type: string | null;
    hook: boolean;
    bot_public: boolean;
    bot_require_code_grant: boolean;
    verify_key: string;
    flags: number;
  };
  scopes: string[];
  expires: string;
  user: {
    id: string;
    username: string;
    avatar: string;
    avatar_decoration: string | null;
    discriminator: string;
    public_flags: number;
  };
}

/**
 * Generates the Discord url which the user will be directed to in order to 
 * approve the bot connection and requested scopes.
 * @returns {string} The Discord OAuth2 url
 */
export function getOAuthUrl() {
  const state = crypto.randomUUID();

  const url = new URL('https://discord.com/api/oauth2/authorize');
  url.searchParams.set('client_id', config.DISCORD_CLIENT_ID);
  url.searchParams.set('redirect_uri', config.DISCORD_REDIRECT_URI);
  url.searchParams.set('response_type', 'code');
  url.searchParams.set('state', state);
  // url.searchParams.set('scope', 'role_connections.write identify');
  url.searchParams.set('scope', 'identify');
  url.searchParams.set('prompt', 'consent');
  return { state, url: url.toString() };
}

/**
 * Given an OAuth2 authorization code grant from the scope approval page, make 
 * a request to Discord's OAuth2 service to retrieve token information, 
 * including the access token, access token expiration, and refresh token.
 * @param {string} code - The OAuth2 authorization code grant
 * @returns {Promise<OAuth2TokenResponse>} The OAuth2 token response
 */
export async function getOAuthTokens(code: string): Promise<OAuth2TokenResponse> {
  const url = 'https://discord.com/api/v10/oauth2/token';
  const body = new URLSearchParams({
    client_id: config.DISCORD_CLIENT_ID,
    client_secret: config.DISCORD_CLIENT_SECRET,
    grant_type: 'authorization_code',
    code,
    redirect_uri: config.DISCORD_REDIRECT_URI,
  });

  const response = await fetch(url, {
    body,
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  if (response.ok) {
    const data = await response.json() as OAuth2TokenResponse;
    return data;
  } else {
    throw new Error(`Error fetching OAuth tokens: [${response.status}] ${response.statusText}`);
  }
}

/**
 * Given a user's Discord ID and tokens, return a valid access token. If the 
 * access token has expired, use the refresh token to get a new one.
 * @param {string} userId - The user's Discord ID
 * @param {DiscordData} tokens - The user's Discord tokens from the storage provider
 * @returns {Promise<string>} A valid Discord access token
 */
export async function getAccessToken(userId: string, tokens: storage.DiscordData): Promise<string> {
  // If the access token has expired, use the refresh token to get a new one
  if (Date.now() > tokens.access_token_expires_in) {
    const url = 'https://discord.com/api/v10/oauth2/token';
    const body = new URLSearchParams({
      client_id: config.DISCORD_CLIENT_ID,
      client_secret: config.DISCORD_CLIENT_SECRET,
      grant_type: 'refresh_token',
      refresh_token: tokens.refresh_token,
    });
    const response = await fetch(url, {
      body,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    if (response.ok) {
      const tokens = await response.json() as OAuth2TokenResponse; // TODO: fix type
      await storage.storeDiscordTokens(userId, {
        access_token: tokens.access_token,
        access_token_expires_in: Date.now() + tokens.expires_in * 1000,
        refresh_token: tokens.refresh_token,
      });
      return tokens.access_token;
    } else {
      throw new Error(`Error refreshing access token: [${response.status}] ${response.statusText}`);
    }
  }
  return tokens.access_token;
}

/**
 * Given a user's Discord ID and tokens, return the user's Discord profile 
 * information.
 * @param {string} userId - The user's Discord ID
 * @param {DiscordData} tokens - The user's Discord tokens from the storage provider
 * @returns {Promise<OAuth2UserInfo>} The user's Discord profile information
 */
export async function getUserProfileInfo(tokens: OAuth2TokenResponse): Promise<OAuth2UserInfo> {
  const url = 'https://discord.com/api/v10/oauth2/@me';
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${tokens.access_token}`,
    },
  });
  if (response.ok) {
    const data = await response.json() as OAuth2UserInfo;
    return data;
  } else {
    throw new Error(`Error fetching user data: [${response.status}] ${response.statusText}`);
  }
}

/**
 * Pushes new connection metadata to Discord for a given user.
 * @param {string} userId - The user's Discord ID
 * @param {DiscordData} tokens - The user's Discord tokens from the storage provider
 * @param {Record<string, string>} metadata - The metadata to push to Discord
 * @returns {Promise<void>}
 */
export async function pushMetadata(userId: string, tokens: storage.DiscordData, metadata: Record<string, string>) {
  // PUT /users/@me/applications/:id/role-connection
  const url = `https://discord.com/api/v10/users/@me/applications/${config.DISCORD_CLIENT_ID}/role-connection`;
  const accessToken = await getAccessToken(userId, tokens);
  const body = {
    platform_name: PLATFORM_NAME,
    metadata,
  };
  const response = await fetch(url, {
    method: 'PUT',
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
  });
  if (!response.ok) {
    throw new Error(`Error pushing discord metadata: [${response.status}] ${response.statusText}`);
  }
}

/**
 * Gets the connection metadata from Discord for a given user.
 * @param {string} userId - The user's Discord ID
 * @param {DiscordData} tokens - The user's Discord tokens from the storage provider
 * @returns {Promise<Record<string, string>>} The connection metadata
 */
export async function getMetadata(userId: string, tokens: storage.DiscordData): Promise<Record<string, string>> {
  // GET /users/@me/applications/:id/role-connection
  const url = `https://discord.com/api/v10/users/@me/applications/${config.DISCORD_CLIENT_ID}/role-connection`;
  const accessToken = await getAccessToken(userId, tokens);
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  if (response.ok) {
    const data = await response.json() as Record<string, string>;
    return data;
  } else {
    throw new Error(`Error getting discord metadata: [${response.status}] ${response.statusText}`);
  }
}