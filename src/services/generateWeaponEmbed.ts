import {EmbedBuilder} from 'discord.js';

export function printWeaponStat(avatarURL: string, playerData: any) {
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
    .addFields('Grenade', playerData.kills_wp_grenade.toLocaleString(), true)
    .addFields('Rifle', playerData.kills_wp_rifles.toLocaleString(), true)
    .addFields('Sidearm', playerData.kills_wp_pistol.toLocaleString(), true)
    .addFields('SMG', playerData.kills_wp_smg.toLocaleString(), true)
    .addFields('Shotgun', playerData.kills_wp_shotgun.toLocaleString(), true)
    .addFields('Turret', playerData.kills_turret.toLocaleString(), true);

  return embed;
}
