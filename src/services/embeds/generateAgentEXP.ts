import {EmbedBuilder} from 'discord.js';

export async function printAgentEXP(
  interaction: Interaction,
  playerData: PlayerData,
) {
  return new EmbedBuilder()
    .setTitle(
      'The Division 2 - Agent EXP: ' +
        playerData.name +
        ' (' +
        playerData.platform +
        ')',
    )
    .setColor('#FF6D10')
    .setThumbnail(interaction.user.avatarURL())
    .addFields(
      {name: 'Clan EXP', value: playerData.xp_clan.toLocaleString()},
      {name: 'PvE EXP', value: playerData.xp_ow.toLocaleString()},
      {name: 'Dark Zone EXP', value: playerData.xp_dz.toLocaleString()},
      {
        name: '24h Clan EXP',
        value: playerData.xp_clan_24h
          ? playerData.xp_clan_24h.toLocaleString()
          : '0',
      },
      {
        name: '7d Clan EXP',
        value: playerData.xp_clan_7d
          ? playerData.xp_clan_7d.toLocaleString()
          : '0',
      },
      {
        name: '30d Clan EXP',
        value: playerData.xp_clan_30d
          ? playerData.xp_clan_30d.toLocaleString()
          : '0',
      },
    );
}
