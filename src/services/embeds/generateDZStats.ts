import {EmbedBuilder} from 'discord.js';

export function printDZStat(interaction: Interaction, playerData: PlayerData) {
  let embed = new EmbedBuilder()
    .setTitle(
      'The Division 2 - Dark Zone Stats: ' +
        playerData.name +
        ' (' +
        playerData.platform +
        ')',
    )
    .setColor('#A25EFF')
    .setThumbnail(interaction.user.avatarURL())
    .addFields(
      {name: 'Rank', value: playerData.level_dz.toString()},
      {name: 'EXP', value: playerData.xp_dz.toLocaleString()},
      {
        name: 'Playtime',
        value:
          Math.round(playerData.timeplayed_dz / 3600) +
          ' hour' +
          (Math.round(playerData.timeplayed_dz / 3600) > 1 ? 's' : ''),
      },
      {
        name: 'Rogue Playtime',
        value:
          Math.round(playerData.timeplayed_rogue / 3600) +
          ' hour' +
          (Math.round(playerData.timeplayed_rogue / 3600) > 1 ? 's' : ''),
      },
      {
        name: 'Longest Time Rogue',
        value:
          Math.round(playerData.maxtime_rogue / 60) +
          ' min' +
          (Math.round(playerData.maxtime_rogue / 60) > 1 ? 's' : ''),
      },
      {
        name: 'Total Players Killed (includes conflict)',
        value: playerData.kills_pvp_dz_total.toLocaleString(),
      },
      {
        name: 'Rogues Killed',
        value: playerData.kills_pvp_dz_rogue.toLocaleString(),
      },
      {
        name: 'Hyenas Killed',
        value: playerData.kills_pve_dz_hyenas.toLocaleString(),
      },
      {
        name: 'Outcasts Killed',
        value: playerData.kills_pve_dz_outcasts.toLocaleString(),
      },
      {
        name: 'Black Tusks Killed',
        value: playerData.kills_pve_dz_blacktusk.toLocaleString(),
      },
      {
        name: 'True Sons Killed',
        value: playerData.kills_pve_dz_truesons.toLocaleString(),
      },
      {
        name: 'Elites Killed',
        value: playerData.kills_pvp_elitebosses.toLocaleString(),
      },
    );

  return embed;
}
