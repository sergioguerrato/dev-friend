require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const { Client, GatewayIntentBits } = require('discord.js');
const desafio = require('./commands/desafio');
const { startScheduler } = require('./scheduler');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Bot online como ${client.user.tag}`);
  startScheduler(client);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'desafio') {
    await desafio.execute(interaction);
  }
});

client.login(process.env.DISCORD_TOKEN);
