import {EmbedBuilder} from 'discord.js';

export function printWeaponStat(avatarURL: string, playerData: PlayerData) {
  let embed = new EmbedBuilder()
    .setTitle(
      'The Division 2 - Weapon Kills: ' +
        playerData.name +
        ' (' +
        playerData.platform +
        ')',
    )
    .setColor('#FF6D10')
    .setThumbnail(avatarURL)
    .addFields(
      {name: 'Grenade', value: playerData.kills_wp_grenade.toLocaleString()},
      {name: 'Rifle', value: playerData.kills_wp_rifles.toLocaleString()},
      {name: 'Sidearm', value: playerData.kills_wp_pistol.toLocaleString()},
      {name: 'SMG', value: playerData.kills_wp_smg.toLocaleString()},
      {name: 'Shotgun', value: playerData.kills_wp_shotgun.toLocaleString()},
      {name: 'Turret', value: playerData.kills_turret.toLocaleString()},
    );

  return embed;
}
