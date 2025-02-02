import discord from 'discord.js';
import { OAuth2API } from '@discordjs/core';
import { Bot } from './bot.js';
import config from '../../config.js';
import * as storage from '../../storage.js';

// Setup bot client (init function)
export function init() {
  const bot = new Bot(config.DISCORD_TOKEN);
}

export function configureOAuth() {
  const rest = new discord.REST({ version: '10' })
    .setToken(config.DISCORD_TOKEN);
  const oauth = new OAuth2API(rest);
}