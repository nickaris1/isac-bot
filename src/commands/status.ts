import {SlashCommandBuilder, ChatInputCommandInteraction} from 'discord.js';

export default {
  data: new SlashCommandBuilder().setName('status'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply('Pong!');
  },
};
