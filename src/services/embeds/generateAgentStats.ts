import {EmbedBuilder} from 'discord.js';

export function printAgentStat(
  interaction: Interaction,
  playerData: PlayerData,
) {
  return new EmbedBuilder()
    .setTitle(
      'The Division 2 - Agent Stats: ' +
        playerData.name +
        ' (' +
        playerData.platform +
        ')',
    )
    .setColor('#FF6D10')
    .setThumbnail(interaction.user.avatarURL())
    .addFields(
      {name: 'Level', value: playerData.level_pve.toFixed(0)},
      {name: 'DZ Rank', value: playerData.level_dz.toFixed(0)},
      {name: 'Conflict Rank', value: playerData.level_pvp.toFixed(0)},
      {name: 'Specialization', value: playerData.specialization},
      {name: 'Gear Score', value: playerData.gearscore.toFixed(0)},
      {name: 'Items Looted', value: playerData.looted.toLocaleString()},
      {
        name: 'PvE Playtime',
        value:
          Math.round(playerData.timeplayed_pve / 3600) +
          ' hour' +
          (Math.round(playerData.timeplayed_pve / 3600) > 1 ? 's' : ''),
      },
      {
        name: 'DZ Playtime',
        value:
          Math.round(playerData.timeplayed_dz / 3600) +
          ' hour' +
          (Math.round(playerData.timeplayed_dz / 3600) > 1 ? 's' : ''),
      },
      {
        name: 'PvP Playtime',
        value:
          Math.round(playerData.timeplayed_pvp / 3600) +
          ' hour' +
          (Math.round(playerData.timeplayed_pvp / 3600) > 1 ? 's' : ''),
      },
      {name: 'Total Kills', value: playerData.kills_total.toLocaleString()},
      {
        name: 'Specialization Kills',
        value: playerData.kills_specialization.toLocaleString(),
      },
      {
        name: 'Headshot Kills',
        value:
          playerData.kills_headshot.toLocaleString() +
          ' (' +
          Math.round(
            (playerData.kills_headshot / playerData.kills_total) * 100,
          ).toString() +
          '%)',
      },
      {
        name: 'Skill Kills',
        value:
          playerData.kills_skill.toLocaleString() +
          ' (' +
          Math.round((playerData.kills_skill / playerData.kills_total) * 100) +
          '%)',
      },
      {name: 'Clan EXP', value: playerData.xp_clan.toLocaleString()},
      {name: 'Commendations', value: playerData.commendations.toLocaleString()},
      {name: 'E-Credits', value: playerData.ecredits.toLocaleString()},
    );
}
