import {logger} from '../utils/logger';
import axios from 'axios';

export async function getPlayerData(
  uplay_id: string,
  platform = '',
  username = '',
) {
  let playerData = {};

  if (useTrackerGG && platform != '' && username != '') {
    logger(
      'API Call @ getPlayerData (TGG): ' +
        config.apiSearchBaseURL_TGG +
        platform +
        '/' +
        username,
    );

    await axios
      .get(config.apiSearchBaseURL_TGG + platform + '/' + username)
      .then(async function (response) {
        if (response.status === 200) {
          if (response.data.data.segments.length > 0) {
            playerData = {
              name: response.data.data.platformInfo.platformUserIdentifier,
              uplay_id: uplay_id,
              platform: response.data.data.platformInfo.platformSlug,
              specialization: response.data.data.segments[0].stats
                .specialization.displayValue
                ? response.data.data.segments[0].stats.specialization
                    .displayValue
                : '-',
              /*avatar: response.data.data.platformInfo.avatarUrl,*/
              gearscore:
                response.data.data.segments[0].stats.latestGearScore.value,
              ecredits: response.data.data.segments[0].stats.eCreditBalance
                .value
                ? response.data.data.segments[0].stats.eCreditBalance.value
                : 0, // Currency
              commendations: response.data.data.segments[0].stats
                .commendationScore.value
                ? response.data.data.segments[0].stats.commendationScore.value
                : 0,
              xp_clan: response.data.data.segments[0].stats.xPClan.value, // clan xp
              xp_clan_24h: null,
              xp_clan_7d: null,
              xp_clan_30d: null,
              // pve
              level_pve:
                response.data.data.segments[0].stats.highestPlayerLevel.value,
              kills_npc: response.data.data.segments[0].stats.killsNpc.value,
              timeplayed_pve:
                response.data.data.segments[0].stats.timePlayedPve.value,
              xp_ow: response.data.data.segments[0].stats.xPPve.value, // pve xp
              xp_ow_24h: null,
              xp_ow_7d: null,
              xp_ow_30d: null,
              kills_pve_hyenas:
                response.data.data.segments[0].stats.killsFactionBlackbloc
                  .value,
              kills_pve_outcasts:
                response.data.data.segments[0].stats.killsFactionCultists.value,
              kills_pve_blacktusk:
                response.data.data.segments[0].stats.killsFactionEndgame.value,
              kills_pve_truesons:
                response.data.data.segments[0].stats.killsFactionMilitia.value,
              // dz
              level_dz: response.data.data.segments[0].stats.rankDZ.value,
              xp_dz: response.data.data.segments[0].stats.xPDZ.value,
              xp_dz_24h: null,
              xp_dz_7d: null,
              xp_dz_30d: null,
              timeplayed_dz:
                response.data.data.segments[0].stats.timePlayedDarkZone.value,
              timeplayed_rogue:
                response.data.data.segments[0].stats.timePlayedRogue.value,
              maxtime_rogue:
                response.data.data.segments[0].stats.timePlayedRogueLongest
                  .value,
              kills_pvp_dz_rogue:
                response.data.data.segments[0].stats.roguesKilled.value,
              kills_pve_dz_hyenas:
                response.data.data.segments[0].stats.killsFactionDzBlackbloc
                  .value,
              kills_pve_dz_outcasts:
                response.data.data.segments[0].stats.killsFactionDzCultists
                  .value,
              kills_pve_dz_blacktusk:
                response.data.data.segments[0].stats.killsFactionDzEndgame
                  .value,
              kills_pve_dz_truesons:
                response.data.data.segments[0].stats.killsFactionDzMilitia
                  .value,
              kills_pvp_dz_total:
                response.data.data.segments[0].stats.playersKilled.value,
              kills_pvp_elitebosses:
                response.data.data.segments[0].stats.killsRoleDzElite.value,
              kills_pvp_namedbosses:
                response.data.data.segments[0].stats.killsRoleDzNamed.value,
              // pvp
              xp_pvp: response.data.data.segments[0].stats.xPPvp.value,
              level_pvp: response.data.data.segments[0].stats.latestConflictRank
                .value
                ? response.data.data.segments[0].stats.latestConflictRank.value
                : 0, // pvp but not dark zone, conflict?
              kills_pvp: response.data.data.segments[0].stats.killsPvP.value,
              timeplayed_pvp:
                response.data.data.segments[0].stats.timePlayedConflict.value, // pvp but not dark zone, conflict?
              // misc acct stats
              timeplayed_total:
                response.data.data.segments[0].stats.timePlayed.value,
              kills_total:
                response.data.data.segments[0].stats.killsSkill.value +
                response.data.data.segments[0].stats
                  .killsSpecializationSharpshooter.value +
                response.data.data.segments[0].stats
                  .killsSpecializationSurvivalist.value +
                response.data.data.segments[0].stats
                  .killsSpecializationDemolitionist.value +
                response.data.data.segments[0].stats.playersKilled.value +
                response.data.data.segments[0].stats.killsNpc.value,
              looted: response.data.data.segments[0].stats.itemsLooted.value,
              headshots: response.data.data.segments[0].stats.headshots.value, // # of headshots
              // kills by source
              kills_bleeding:
                response.data.data.segments[0].stats.killsBleeding.value,
              kills_shocked:
                response.data.data.segments[0].stats.killsShocked.value,
              kills_burning:
                response.data.data.segments[0].stats.killsBurning.value,
              kills_ensnare:
                response.data.data.segments[0].stats.killsEnsnare.value,
              kills_headshot:
                response.data.data.segments[0].stats.killsHeadshot.value, // # of headshot kills
              kills_skill:
                response.data.data.segments[0].stats.killsSkill.value,
              kills_turret:
                response.data.data.segments[0].stats.headshots.value,
              kills_ensnare:
                response.data.data.segments[0].stats.killsWeaponMounted.value,
              // weapons kills
              kills_wp_pistol:
                response.data.data.segments[0].stats.killsWeaponPistol.value,
              kills_wp_grenade:
                response.data.data.segments[0].stats.killsWeaponGrenade.value,
              kills_wp_smg:
                response.data.data.segments[0].stats.killsWeaponSubMachinegun
                  .value,
              kills_wp_shotgun:
                response.data.data.segments[0].stats.killsWeaponShotgun.value,
              kills_wp_rifles:
                response.data.data.segments[0].stats.killsWeaponRifle.value,
              kills_specialization:
                response.data.data.segments[0].stats
                  .killsSpecializationSharpshooter.value +
                response.data.data.segments[0].stats
                  .killsSpecializationSurvivalist.value +
                response.data.data.segments[0].stats
                  .killsSpecializationDemolitionist.value,
            };

            exp_data = await pool.query(
              "SELECT clan_exp, pve_exp, dz_exp, DATE_FORMAT(date_added, '%Y-%m-%d') as date FROM daily_exp_snapshots WHERE uplay_id = ? GROUP BY date ORDER BY date_added DESC LIMIT 30",
              [playerData.uplay_id],
            );

            if (exp_data.length > 1) {
              let clan_exp = exp_data.map(e => e.clan_exp);
              let pve_exp = exp_data.map(e => e.pve_exp);
              let dz_exp = exp_data.map(e => e.dz_exp);

              if (exp_data.length >= 2) {
                playerData.xp_clan_24h = getClanExp(clan_exp, 1);
                playerData.xp_ow_24h = pve_exp[0] - pve_exp[1];
                playerData.xp_dz_24h = dz_exp[0] - dz_exp[1];

                // defaults
                playerData.xp_clan_7d = getClanExp(clan_exp, 7);
                playerData.xp_ow_7d = pve_exp[0] - pve_exp[pve_exp.length - 1];
                playerData.xp_dz_7d = dz_exp[0] - dz_exp[dz_exp.length - 1];
                // defaults
                playerData.xp_clan_30d = getClanExp(clan_exp, 30);
                playerData.xp_ow_30d = pve_exp[0] - pve_exp[pve_exp.length - 1];
                playerData.xp_dz_30d = dz_exp[0] - dz_exp[dz_exp.length - 1];
              }

              // Overwrite if data exists
              if (exp_data.length >= 7) {
                playerData.xp_ow_7d = pve_exp[0] - pve_exp[6];
                playerData.xp_dz_7d = dz_exp[0] - dz_exp[6];
              }
              if (exp_data.length >= 30) {
                playerData.xp_ow_30d = pve_exp[0] - pve_exp[29];
                playerData.xp_dz_30d = dz_exp[0] - dz_exp[29];
              }
            }
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    logger('API Call @ getPlayerData: ' + config.apiPlayerURL + uplay_id);

    await axios
      .get(config.apiPlayerURL + uplay_id)
      .then(async function (response) {
        if (response.status === 200) {
          if (response.data.playerfound === true) {
            // Parse extra data
            try {
              extraData = JSON.parse(response.data.extra_data);
            } catch (err) {
              extraData = {};
              helper.printStatus('Unable to parse extra data.');
            }

            playerData = {
              name: response.data.name,
              uplay_id: uplay_id,
              platform: response.data.platform,
              specialization: response.data.specialization
                ? response.data.specialization
                : '-',
              //             avatar: response.data.avatar_146,
              gearscore: response.data.gearscore,
              // lastlogin: response.data.utime, // Query time
              ecredits: response.data.ecredits, // Currency
              commendations: extraData['LatestCommendationScore']
                ? extraData['LatestCommendationScore']
                : 0,
              xp_clan: response.data.xp_clan, // clan xp
              xp_clan_24h: null,
              xp_clan_7d: null,
              xp_clan_30d: null,
              // pve
              level_pve: response.data.level_pve,
              kills_npc: response.data.kills_npc,
              timeplayed_pve: response.data.timeplayed_pve,
              xp_ow: response.data.xp_ow, // pve xp
              xp_ow_24h: null,
              xp_ow_7d: null,
              xp_ow_30d: null,
              kills_pve_hyenas: response.data.kills_pve_hyenas,
              kills_pve_outcasts: response.data.kills_pve_outcasts,
              kills_pve_blacktusk: response.data.kills_pve_blacktusk,
              kills_pve_truesons: response.data.kills_pve_truesons,
              // dz
              level_dz: response.data.level_dz,
              xp_dz: response.data.xp_dz,
              xp_dz_24h: null,
              xp_dz_7d: null,
              xp_dz_30d: null,
              timeplayed_dz: response.data.timeplayed_dz,
              timeplayed_rogue: response.data.timeplayed_rogue,
              maxtime_rogue: response.data.maxtime_rogue,
              kills_pvp_dz_rogue: response.data.kills_pvp_dz_rogue,
              kills_pve_dz_hyenas: response.data.kills_pve_dz_hyenas,
              kills_pve_dz_outcasts: response.data.kills_pve_dz_outcasts,
              kills_pve_dz_blacktusk: response.data.kills_pve_dz_blacktusk,
              kills_pve_dz_truesons: response.data.kills_pve_dz_truesons,
              kills_pvp_dz_total: response.data.kills_pvp_dz_total,
              kills_pvp_elitebosses: response.data.kills_pvp_elitebosses,
              kills_pvp_namedbosses: response.data.kills_pvp_namedbosses,
              // pvp
              xp_pvp: response.data.xp_pvp,
              level_pvp: extraData['LatestLevel.rankType.OrganizedPvpXP']
                ? extraData['LatestLevel.rankType.OrganizedPvpXP']
                : 0, // pvp but not dark zone, conflict?
              kills_pvp: response.data.kills_pvp,
              timeplayed_pvp: response.data.timeplayed_pvp, // pvp but not dark zone, conflict?
              // misc acct stats
              timeplayed_total: response.data.timeplayed_total,
              kills_total: response.data.kills_total,
              looted: response.data.looted,
              headshots: response.data.headshots, // # of headshots
              // kills by source
              kills_bleeding: response.data.kills_bleeding,
              kills_shocked: response.data.kills_shocked,
              kills_burning: response.data.kills_burning,
              kills_ensnare: response.data.kills_ensnare,
              kills_headshot: response.data.kills_headshot, // # of headshot kills
              kills_skill: response.data.kills_skill,
              kills_turret: response.data.kills_turret,
              kills_ensnare: response.data.kills_ensnare,
              // weapons kills
              kills_wp_pistol: response.data.kills_wp_pistol,
              kills_wp_grenade: extraData[
                'weaponNameKills.weaponName.player_grenade_landing'
              ]
                ? extraData['weaponNameKills.weaponName.player_grenade_landing']
                : 0,
              kills_wp_smg: response.data.kills_wp_smg,
              kills_wp_shotgun: response.data.kills_wp_shotgun,
              kills_wp_rifles: response.data.kills_wp_rifles,
              kills_specialization: response.data.kills_specialization,
            };

            exp_data = await pool.query(
              "SELECT clan_exp, pve_exp, dz_exp, DATE_FORMAT(date_added, '%Y-%m-%d') as date FROM daily_exp_snapshots WHERE uplay_id = ? GROUP BY date ORDER BY date_added DESC LIMIT 30",
              [playerData.uplay_id],
            );

            if (exp_data.length > 1) {
              let clan_exp = exp_data.map(e => e.clan_exp);
              let pve_exp = exp_data.map(e => e.pve_exp);
              let dz_exp = exp_data.map(e => e.dz_exp);

              if (exp_data.length >= 2) {
                playerData.xp_clan_24h = getClanExp(clan_exp, 1);
                playerData.xp_ow_24h = pve_exp[0] - pve_exp[1];
                playerData.xp_dz_24h = dz_exp[0] - dz_exp[1];

                // defaults
                playerData.xp_clan_7d = getClanExp(clan_exp, 7);
                playerData.xp_ow_7d = pve_exp[0] - pve_exp[pve_exp.length - 1];
                playerData.xp_dz_7d = dz_exp[0] - dz_exp[dz_exp.length - 1];
                // defaults
                playerData.xp_clan_30d = getClanExp(clan_exp, 30);
                playerData.xp_ow_30d = pve_exp[0] - pve_exp[pve_exp.length - 1];
                playerData.xp_dz_30d = dz_exp[0] - dz_exp[dz_exp.length - 1];
              }

              // Overwrite if data exists
              if (exp_data.length >= 7) {
                playerData.xp_ow_7d = pve_exp[0] - pve_exp[6];
                playerData.xp_dz_7d = dz_exp[0] - dz_exp[6];
              }
              if (exp_data.length >= 30) {
                playerData.xp_ow_30d = pve_exp[0] - pve_exp[29];
                playerData.xp_dz_30d = dz_exp[0] - dz_exp[29];
              }
            }
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return playerData;
}

function getClanExp(data: Record<string, unknown>[], days: number) {
  days = days == 1 ? 2 : days;

  let end_index = 0;
  let prev_val = data[0];
  let no_of_days = data.length < days ? data.length : days;

  for (var i = 1; i < no_of_days; i++) {
    if (prev_val < data[i]) {
      end_index = i - 1;
      break;
    } else {
      prev_val = data[i];
      end_index++;
    }
  }

  return data[0] - data[end_index];
}
