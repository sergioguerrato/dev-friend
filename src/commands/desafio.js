const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getRandomProblem } = require('../codeforces');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('desafio')
    .setDescription('Receba um desafio de programação aleatório do Codeforces'),

  async execute(interaction) {
    await interaction.deferReply();

    const problem = await getRandomProblem();

    const tags = problem.tags.length > 0
      ? problem.tags.join(', ')
      : 'sem tags';

    const embed = new EmbedBuilder()
    .setTitle(problem.name)
    .setURL(problem.url)
    .setDescription(`Dificuldade: **${problem.rating}**`)
    .addFields(
        { name: 'Tags', value: tags }
    )
    .setColor(0x2F2C7C) // cor que você curte 👀
    .setFooter({ text: 'DevFriend • Powered by Codeforces' });

    await interaction.editReply({ embeds: [embed] });
  },
};
