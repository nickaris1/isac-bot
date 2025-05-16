import {EmbedBuilder} from 'discord.js';

export function printPVEStat(interaction: Interaction, playerData: PlayerData) {
  let embed = new EmbedBuilder()
    .setTitle(
      'The Division 2 - PvE Stats: ' +
        playerData.name +
        ' (' +
        playerData.platform +
        ')',
    )
    .setColor('#34CFD5')
    .setThumbnail(interaction.user.avatarURL())
    .addFields(
      {name: 'Level', value: playerData.level_pve.toString()},
      {name: 'Gear Score', value: playerData.gearscore.toString()},
      {name: 'Specialization', value: playerData.specialization},
      {name: 'EXP', value: playerData.xp_ow.toLocaleString()},
      {name: 'Items Looted', value: playerData.looted.toLocaleString()},
      {
        name: 'Playtime',
        value: `${Math.round(playerData.timeplayed_pve / 3600)} hour ${Math.round(playerData.timeplayed_pve / 3600) > 1 ? 's' : ''}`,
      },
      {
        name: 'Hyenas Killed',
        value: playerData.kills_pve_hyenas.toLocaleString(),
      },
      {
        name: 'Outcasts Killed',
        value: playerData.kills_pve_outcasts.toLocaleString(),
      },
      {
        name: 'Black Tusks Killed',
        value: playerData.kills_pve_blacktusk.toLocaleString(),
      },
      {
        name: 'True Sons Killed',
        value: playerData.kills_pve_truesons.toLocaleString(),
      },
    );

  return embed;
}
