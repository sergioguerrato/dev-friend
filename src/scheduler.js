const cron = require('node-cron');
const { EmbedBuilder } = require('discord.js');
const { getRandomProblem } = require('./codeforces');
const { getTechNews, getGamingNews } = require('./newsapi');

async function postDailyChallenge(client) {
  const channel = await client.channels.fetch(process.env.CHANNEL_ID);

  const problem = await getRandomProblem();

  const tags = problem.tags.length > 0
    ? problem.tags.join(', ')
    : 'sem tags';

  const embed = new EmbedBuilder()
    .setTitle(problem.name)
    .setURL(problem.url)
    .setDescription(`Dificuldade: **${problem.rating}**`)
    .addFields({ name: 'Tags', value: tags })
    .setColor(0x2F2C7C)
    .setFooter({ text: 'DevFriend • Powered by Codeforces' });

  const message = await channel.send({ embeds: [embed] });

  await message.startThread({
    name: `💬 ${problem.name}`,
    autoArchiveDuration: 1440,
  });
}

async function postNews(client, channelId, fetchFn, color, footerText) {
  const channel = await client.channels.fetch(channelId);
  const article = await fetchFn();

  const embed = new EmbedBuilder()
    .setTitle(article.title)
    .setURL(article.url)
    .setDescription(article.description || null)
    .setImage(article.urlToImage || null)
    .setColor(color)
    .setFooter({ text: `${footerText} • ${article.source.name}` });

  await channel.send({ embeds: [embed] });
}

function startScheduler(client) {
  const tz = { timezone: 'America/Sao_Paulo' };

  cron.schedule('*/30 * * * *', () => postDailyChallenge(client), tz);

  cron.schedule('*/30 * * * *', () =>
    postNews(client, process.env.NEWS_CHANNEL_ID, getTechNews, 0x0099FF, 'DevFriend Tech'), tz);

  cron.schedule('*/30 * * * *', () =>
    postNews(client, process.env.GAMES_CHANNEL_ID, getGamingNews, 0x57F287, 'DevFriend Games'), tz);

  console.log('Scheduler iniciado — desafios e notícias a cada 30 minutos (Brasília)');
}

module.exports = { startScheduler, postDailyChallenge, postNews, getTechNews, getGamingNews };
