import {SlashCommandBuilder, ChatInputCommandInteraction} from 'discord.js';
import {Platform} from '../utils/enums';
import {isEmpty} from '../utils/helpers';
import {printWeaponStat} from '../services/generateWeaponEmbed';
import {getPlayerData} from '../services/getPlayerData';

export default {
  data: new SlashCommandBuilder()
    .setName('check')
    .setDescription('Check agent stats')
    .addStringOption(_ =>
      _.setName('name').setDescription('Agent name').setRequired(true),
    )
    .addStringOption(_ =>
      _.setName('type').setDescription('type').setRequired(false),
    )
    .addStringOption(_ =>
      _.setName('platform')
        .setDescription('Platform')
        .setRequired(true)
        .setChoices(
          {name: 'PC', value: Platform.UBI},
          {name: 'PS', value: Platform.PS},
          {name: 'XBOX', value: Platform.XBOX},
        )
        .setAutocomplete(true),
    ),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const username = interaction.options.getString('name');
    const type = interaction.options.getString('type') || 'agent';
    const platform = interaction.options.getString('platform');

    if (!username) {
      await interaction.reply('Please provide an agent name.');
      return;
    }
    if (!platform) {
      await interaction.reply('Please provide a platform.');
      return;
    }

    let playerData = null;
    if (['agent', 'weapons', 'pve', 'dz', 'darkzone', 'exp'].includes(type)) {
      playerData = await getPlayerData(platform, username);

      if (isEmpty(playerData)) {
        await interaction.reply({
          content: `No data found for ${username} on ${platform}.`,
          ephemeral: true,
        });

        return;
      }
    }

    if (type === 'agent') {
      if (!isEmpty(playerData)) {
        printAgentStat(message, playerData);
        return;
      }
    }

    if (type === 'weapons') {
      if (!isEmpty(playerData)) {
        const embed = printWeaponStat(
          interaction.user.avatarURL() ?? '',
          playerData,
        );

        await interaction.reply({embeds: [embed]});
        return;
      }
    }

    /*************************************************
  // PRINT PVE DATA
  *************************************************/
    if (type === 'pve') {
      if (!isEmpty(playerData)) {
        printPVEStat(message, playerData);
        return;
      }
    }

    /*************************************************
  // PRINT DZ DATA
  *************************************************/
    if (type === 'dz' || command === 'darkzone') {
      if (!isEmpty(playerData)) {
        printDZStat(message, playerData);
        return;
      }
    }

    /*************************************************
  // PRINT EXP
  *************************************************/
    if (type === 'exp') {
      if (!isEmpty(playerData)) {
        printAgentEXP(message, playerData);
        return;
      }
    }
  },
};
