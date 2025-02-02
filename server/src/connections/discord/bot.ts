import discord from 'discord.js';

// Configure commands
const temp = new discord.ContextMenuCommandBuilder()
  .setName('View Shibboleth information')
  .setType(discord.ApplicationCommandType.User);

export class Bot {
  private token: string;
  private client: discord.Client;

  constructor(
    token: string
  ) {
    this.token = token;
    this.client = new discord.Client({
      intents: [discord.GatewayIntentBits.Guilds]
    });
  }

  public async registerCommands(): Promise<void> {
    await this.client.application?.commands.set([
      temp
    ]);
  }

  public async start(): Promise<void> {
    this.client.on('ready', () => {
      if (this.client.user === null) {
        throw new Error('Discord client user is null');
      }
      console.log(`Logged in as ${this.client.user.tag}!`);
    });
  
    this.client.login(this.token);
  }

  public async stop(): Promise<void> {
    await this.client.destroy();
  }
}

