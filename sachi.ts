import axios from 'axios';
import Discord, {Events} from 'discord.js';
import {config} from './config';
import {logger} from './src/utils/logger';

import {MISSING_PERMISSION_ERR} from './src/utils/errors';
import {getPlayerData} from './src/services/getPlayerData';
const client = new Discord.Client({
  intents: ['Guilds'],
});
const useTrackerGG = true;

const embedFooter = 'via ubisoftconnect.com | repo.sachi.lk';
const embedFooterImg = 'https://repo.sachi.lk/isac/assets/img/logo.png';

// Possible parameters for !platform
const platforms = ['uplay', 'psn', 'xbl'];

/******************************
  Bot Auth
*******************************/
client.login(config.devBotToken);

/******************************
  Event Listeners
*******************************/

client.on('error', e => console.error(e));
client.on('warn', e => console.warn(e));

client.on(Events.GuildCreate, async function (guild) {
  logger('Joined a new guild: ' + guild.name);
});

client.on(Events.ClientReady, async function (client) {
  logger('I am ready!');

  client.user.setPresence({
    activities: [
      {
        name: ' 👀',
      },
    ],
    status: 'online',
  });
});

/******************************
  Message Listener
*******************************/

client.on('message', async function (message) {
  if (message.author.bot) return; // Ignore bot messages
  if (!message.channel.guild) return; // Ignore dm

  let original_message = message.content;
  message.content = message.content
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .toLowerCase();

  const prefix = await getServerPrefix(message.guild.id);
  const args = message.content.slice(prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  let server_platform = await getServerPlatform(message.guild.id);
  let isAdmin = helper.isAdmin(message.member);
  let owner = helper.owner(message.member);
  let playerData = {};

  if (command != 'isac' && prefix != message.content.charAt(0)) return; // ignore if prefix don't match EXCEPT for isac command
  if (commands.includes(command) == false) return; // Ignore commands not in "commands" array
  if (message.autoDelete) message.delete({timeout: 15000}); // Delete Author's Msg

  message.logCommandID = await helper.logCommands(message); // log command to DB and return entry ID

  updateServerInfo(message.guild.id, message.guild.name); // Create new server info and/or update last active time

  let apiSearchURL =
    config.apiSearchBaseURL + 'platform=' + server_platform + '&name=';

  if (useTrackerGG) {
    apiSearchURL = config.apiSearchBaseURL_TGG + server_platform + '/';
  }

  /*************************************************
  // CHANGE NICKNAMES OF USERS TO THEIR AGENT NAMES
  *************************************************/
  if (command === 'update_nicknames') {
    let members = [];
    if (isAdmin) {
      await message.channel.guild.members.fetch().then(async function (guild) {
        // exclude server owner as bot can't change owner's nickname
        members = message.guild.members.cache
          .filter(function (member) {
            return (
              member.user.bot === false &&
              member.user.id != member.guild.ownerID
            );
          })
          .map(function (member) {
            return {
              id: member.user.id,
              nickname: member.nickname,
              member: member,
            };
          });

        if (members.length > 0) {
          let success = [];
          let failure = [];

          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  await members[i].member
                    .setNickname(res[0].agent_name)
                    .then(function (member) {
                      console.log(
                        'Updated nickname of: ' +
                          member.displayName +
                          ' to ' +
                          res[0].agent_name,
                      );
                      success.push(res[0].agent_name);
                    })
                    .catch(function (err) {
                      console.log(
                        'Unable to update nickname of: ' +
                          members[i].member.displayName,
                      );
                      console.log('Reason: ' + err.message + '\n');
                      failure.push(res[0].agent_name);
                    });
                }
              });
          }

          if (success.length > 0)
            message.channel
              .send(
                'Successfully updated nicknames in ' +
                  message.guild.name +
                  ': `' +
                  success.join(', ') +
                  '`',
              )
              .then(function (msg) {
                if (message.autoDelete) msg.delete({timeout: 15000});
              });
        }
      });
    }
    return;
  }

  /*************************************************
  // CLAN COMMANDS
  *************************************************/
  if (command === 'clan') {
    if (isAdmin) {
      if (args.length > 0) {
        if (args[0] == 'removerole') {
          pool.query(
            'UPDATE servers SET clan_role_id = ? WHERE server_id = ?',
            ['', message.guild.id],
          );
          message.channel
            .send('Clan role has been removed.')
            .then(function (msg) {
              if (message.autoDelete) msg.delete({timeout: 15000});
            });
        }

        if (args[0] == 'role') {
          if (args.length > 1) {
            let role_arg = original_message
              .slice(prefix.length)
              .replace(command, '')
              .replace(args[0], '')
              .trim(); // args without lowercase and space in between
            let role_search = message.guild.roles.cache.filter(function (role) {
              return role.name == role_arg;
            });

            if (lodash.isEmpty(role_search) == false) {
              let clan_role_id = role_search.map(function (role) {
                return role.id;
              })[0];
              pool.query(
                'UPDATE servers SET clan_role_id = ? WHERE server_id = ?',
                [clan_role_id, message.guild.id],
              );
              message.channel
                .send('Clan role has been set to ' + role_arg + '.')
                .then(function (msg) {
                  if (message.autoDelete) msg.delete({timeout: 15000});
                });
            } else {
              message.channel
                .send(getErrorMessage(7, {role: role_arg}))
                .then(function (msg) {
                  if (message.autoDelete) msg.delete({timeout: 15000});
                });
            }
          } else {
            pool
              .query('SELECT * FROM servers WHERE server_id = ?', [
                message.guild.id,
              ])
              .then(function (res) {
                if (res.length > 0) {
                  if (res[0].clan_role_id) {
                    current_clan_role = message.guild.roles.cache.filter(
                      function (role) {
                        return role.id == res[0].clan_role_id;
                      },
                    );

                    if (current_clan_role) {
                      message.channel
                        .send(
                          'The current clan role is set to ' +
                            current_clan_role.values().next().value.name +
                            '. !rank will only display results where members are of this role or have been manually added.',
                        )
                        .then(function (msg) {
                          if (message.autoDelete) msg.delete({timeout: 15000});
                        });
                    }
                  } else {
                    message.channel
                      .send('No clan role has been set.')
                      .then(function (msg) {
                        if (message.autoDelete) msg.delete({timeout: 15000});
                      });
                  }
                }
              });
          }
        }

        // list manually added clan agents
        if (args[0] == 'list') {
          manual_agents = await pool
            .query('SELECT * FROM server_agents WHERE server_id = ?', [
              message.guild.id,
            ])
            .then(function (res) {
              if (res.length > 0) {
                return res.map(function (res) {
                  return {id: res.agent_id, name: res.agent_name};
                });
              } else {
                return [];
              }
            });

          if (lodash.isEmpty(manual_agents) == false) {
            manual_agent_names = manual_agents.map(function (agent) {
              return agent.name;
            });

            let embed = new Discord.MessageEmbed()
              .setTitle('Manually added agents for ' + message.guild.name)
              .setColor('#FF6D10')
              .setFooter(embedFooter, embedFooterImg);

            embed.setDescription(manual_agent_names.sort().join('\n'));

            message.channel.send(embed).then(function (msg) {
              if (message.autoDelete) msg.delete({timeout: 15000});
            });
          } else {
            message.channel
              .send('No agents have been manually added for this clan yet.')
              .then(function (msg) {
                if (message.autoDelete) msg.delete({timeout: 15000});
              });
          }
        }

        if (args[0] == 'add') {
          if (args.length > 1) {
            let agent_name_arg = original_message
              .slice(prefix.length)
              .replace(command, '')
              .replace(args[0], '')
              .trim(); // args without lowercase and space in between

            if (useTrackerGG) {
              apiSearchURL =
                config.apiSearchBaseURL_TGG + server_platform + '/';
            } else {
              apiSearchURL =
                config.apiSearchBaseURL +
                'platform=' +
                server_platform +
                '&name=';
            }

            // check if agent exists first
            axios
              .get(apiSearchURL + agent_name_arg)
              .then(async function (response) {
                if (response.status === 200) {
                  // account search results
                  if (
                    useTrackerGG == false &&
                    response.data.results &&
                    response.data.results.length > 0
                  ) {
                    uplay_id = response.data.results[0].pid;
                    agent_name = response.data.results[0].name;

                    await pool
                      .query(
                        'INSERT INTO server_agents (server_id, agent_name, agent_id, type, added_by_id, added_by_username, date_added) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE added_by_id = ?, added_by_username = ?, date_added = ?',
                        [
                          message.guild.id,
                          agent_name,
                          uplay_id,
                          'add',
                          message.author.id,
                          message.author.username,
                          moment().format('YYYY-M-D HH:mm:ss'),
                          message.author.id,
                          message.author.username,
                          moment().format('YYYY-M-D HH:mm:ss'),
                        ],
                      )
                      .then(async function (res) {
                        message.channel
                          .send(
                            'Agent ' +
                              agent_name_arg +
                              ' manually added to clan list.',
                          )
                          .then(function (msg) {
                            if (message.autoDelete)
                              msg.delete({timeout: 15000});
                          });
                      });
                  } else if (useTrackerGG && response.data.data) {
                    uplay_id = response.data.data.platformInfo.platformUserId;
                    agent_name =
                      response.data.data.platformInfo.platformUserIdentifier;

                    await pool
                      .query(
                        'INSERT INTO server_agents (server_id, agent_name, agent_id, type, added_by_id, added_by_username, date_added) VALUES (?, ?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE added_by_id = ?, added_by_username = ?, date_added = ?',
                        [
                          message.guild.id,
                          agent_name,
                          uplay_id,
                          'add',
                          message.author.id,
                          message.author.username,
                          moment().format('YYYY-M-D HH:mm:ss'),
                          message.author.id,
                          message.author.username,
                          moment().format('YYYY-M-D HH:mm:ss'),
                        ],
                      )
                      .then(async function (res) {
                        message.channel
                          .send(
                            'Agent ' +
                              agent_name_arg +
                              ' manually added to clan list.',
                          )
                          .then(function (msg) {
                            if (message.autoDelete)
                              msg.delete({timeout: 15000});
                          });
                      });
                  } else {
                    message.channel
                      .send(
                        getErrorMessage(1, {
                          username: agent_name_arg,
                          server_platform: server_platform,
                        }),
                      )
                      .then(function (msg) {
                        if (message.autoDelete) msg.delete({timeout: 15000});
                      });
                  }
                }
              });
          }
        }

        if (args[0] == 'remove') {
          if (args.length > 1) {
            let agent_name_arg = original_message
              .slice(prefix.length)
              .replace(command, '')
              .replace(args[0], '')
              .trim(); // args without lowercase and space in between
            pool
              .query(
                'DELETE FROM server_agents WHERE server_id = ? AND agent_name = ?',
                [message.guild.id, agent_name_arg],
              )
              .then(function (res) {
                if (res.affectedRows > 0) {
                  message.channel
                    .send(
                      'Manually added clan agent ' +
                        agent_name_arg +
                        ' removed.',
                    )
                    .then(function (msg) {
                      if (message.autoDelete) msg.delete({timeout: 15000});
                    });
                } else {
                  message.channel
                    .send(
                      'Error: Unable to locate manually added clan agent by the name of ' +
                        agent_name_arg +
                        '.',
                    )
                    .then(function (msg) {
                      if (message.autoDelete) msg.delete({timeout: 15000});
                    });
                }
              });
          }
        }
      }
    } else
      message.author
        .send(getErrorMessage(5, {server_name: message.channel.guild}))
        .then(function (msg) {
          if (message.autoDelete) msg.delete({timeout: 15000});
        });
  }

  /*************************************************
  // SET DEFAULT PLATFORM FOR SERVER
  *************************************************/
  if (command === 'platform') {
    if (args.length == 0) {
      message.channel
        .send(
          "This Discord server's platform is currently: " +
            platformsMap[server_platform],
        )
        .then(function (msg) {
          if (message.autoDelete) msg.delete({timeout: 15000});
        });
      return;
    }

    if (args.length > 0) {
      if (isAdmin) {
        if (platforms.includes(args[0])) {
          await pool
            .query(
              'INSERT INTO platforms (server_id, platform, date_added) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE platform = ?, date_added = ?',
              [
                message.guild.id,
                args[0],
                moment().format('YYYY-M-D HH:mm:ss'),
                args[0],
                moment().format('YYYY-M-D HH:mm:ss'),
              ],
            )
            .then(async function (res) {
              message.channel
                .send(
                  "This Discord server's platform has been updated to: " +
                    platformsMap[args[0]],
                )
                .then(function (msg) {
                  if (message.autoDelete) msg.delete({timeout: 15000});
                });
            });
        } else {
          message.channel.send(getErrorMessage(4)).then(function (msg) {
            if (message.autoDelete) msg.delete({timeout: 15000});
          });
        }
      } else {
        message.author
          .send(getErrorMessage(5, {server_name: message.channel.guild}))
          .then(function (msg) {
            if (message.autoDelete) msg.delete({timeout: 15000});
          });
      }
    }
  }

  /*************************************************
  // REGISTER AGENT ID TO DISCORD USER
  *************************************************/
  if (command === 'register') {
    if (args.length > 0) {
      let username = args.join(' ');

      // specific platform so doesn't use default server's
      if (platforms.includes(args[0])) {
        username = args.slice(1).join(' ');
        server_platform = args[0];

        if (useTrackerGG) {
          apiSearchURL = config.apiSearchBaseURL_TGG + server_platform + '/';
        } else {
          apiSearchURL =
            config.apiSearchBaseURL + 'platform=' + server_platform + '&name=';
        }
      }

      // search accounts
      axios
        .get(apiSearchURL + username)
        .then(async function (response) {
          if (response.status === 200) {
            // account search results
            if (
              useTrackerGG == false &&
              response.data.results &&
              response.data.results.length > 0
            ) {
              uplay_id = response.data.results[0].pid;
              agent_name = response.data.results[0].name;

              await pool
                .query(
                  'INSERT INTO users (user_id, uplay_id, agent_name, platform, date_added) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE uplay_id = ?, agent_name = ?, platform = ?, date_added = ?',
                  [
                    message.author.id,
                    uplay_id,
                    agent_name,
                    server_platform,
                    moment().format('YYYY-M-D HH:mm:ss'),
                    uplay_id,
                    agent_name,
                    server_platform,
                    moment().format('YYYY-M-D HH:mm:ss'),
                  ],
                )
                .then(async function (res) {
                  message.channel
                    .send('User <-> Agent registered. Fetching Agent stats.')
                    .then(function (msg) {
                      if (message.autoDelete) msg.delete({timeout: 15000});
                    });
                  playerData = await getPlayerData(uplay_id);
                  printAgentStat(message, playerData);
                });
            } else if (useTrackerGG && response.data.data) {
              uplay_id = response.data.data.platformInfo.platformUserId;
              agent_name =
                response.data.data.platformInfo.platformUserIdentifier;

              await pool
                .query(
                  'INSERT INTO users (user_id, uplay_id, agent_name, platform, date_added) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE uplay_id = ?, agent_name = ?, platform = ?, date_added = ?',
                  [
                    message.author.id,
                    uplay_id,
                    agent_name,
                    server_platform,
                    moment().format('YYYY-M-D HH:mm:ss'),
                    uplay_id,
                    agent_name,
                    server_platform,
                    moment().format('YYYY-M-D HH:mm:ss'),
                  ],
                )
                .then(async function (res) {
                  message.channel
                    .send('User <-> Agent registered. Fetching Agent stats.')
                    .then(function (msg) {
                      if (message.autoDelete) msg.delete({timeout: 15000});
                    });
                  playerData = await getPlayerData(
                    uplay_id,
                    server_platform,
                    agent_name,
                  );
                  printAgentStat(message, playerData);
                });
            } else {
              message.channel
                .send(
                  getErrorMessage(1, {
                    username: username,
                    server_platform: server_platform,
                  }),
                )
                .then(function (msg) {
                  if (message.autoDelete) msg.delete({timeout: 15000});
                });
            }
          }
        })
        .catch(function (error) {
          console.log(error);
          message.channel
            .send(
              getErrorMessage(1, {
                username: username,
                server_platform: server_platform,
              }),
            )
            .then(function (msg) {
              if (message.autoDelete) msg.delete({timeout: 15000});
            });
        });
      return;
    }

    message.channel.send(getErrorMessage(2)).then(function (msg) {
      if (message.autoDelete) msg.delete({timeout: 15000});
    });
  }

  /*************************************************
  // UNREGISTER AGENT ID
  *************************************************/
  if (command === 'unregister') {
    await pool
      .query('DELETE FROM users WHERE user_id = ?', [message.author.id])
      .then(async function (res) {
        message.channel
          .send('User <-> Agent link removed.')
          .then(function (msg) {
            if (message.autoDelete) msg.delete({timeout: 15000});
          });
        return;
      });
  }
  /*************************************************
  // PRINT SERVER'S AGENTS DATA
  *************************************************/
  if (command === 'rank') {
    if (args.length > 0) {
      if (rankedData.includes(args[0])) {
        rankGet(message, args[0], server_platform);
        return;
      }
    }

    message.channel.send(getErrorMessage(3)).then(function (msg) {
      if (message.autoDelete) msg.delete({timeout: 15000});
    });
  }
});

// Fetches top 10 highest stat type from registered members of the discord server
async function rankGet(message, type, server_platform) {
  await message.channel.guild.members.fetch().then(async function (guild) {
    let clan_role_id = await pool
      .query('SELECT * FROM servers WHERE server_id = ?', [message.guild.id])
      .then(function (res) {
        if (res.length > 0)
          return res[0].clan_role_id ? res[0].clan_role_id : null;
        else return null;
      })
      .catch(function (error) {
        return null;
      });

    // Array of member id + username objects
    let members = [];

    // Clan role restriction - only show results where members are of role specified
    if (clan_role_id)
      members = message.guild.members.cache
        .filter(function (member) {
          return (
            member.user.bot === false && member._roles.includes(clan_role_id)
          );
        })
        .map(function (member) {
          return {id: member.user.id, username: member.user.username};
        });
    else
      members = message.guild.members.cache
        .filter(function (member) {
          return member.user.bot === false;
        })
        .map(function (member) {
          return {id: member.user.id, username: member.user.username};
        });

    // Manually added agents
    if (useTrackerGG) {
      manual_agents = await pool
        .query('SELECT * FROM server_agents WHERE server_id = ?', [
          message.guild.id,
        ])
        .then(function (res) {
          if (res.length > 0) {
            return res.map(function (res) {
              return res.agent_name;
            });
          } else {
            return [];
          }
        });
    } else {
      manual_agents = await pool
        .query('SELECT * FROM server_agents WHERE server_id = ?', [
          message.guild.id,
        ])
        .then(function (res) {
          if (res.length > 0) {
            return res.map(function (res) {
              return res.agent_id;
            });
          } else {
            return [];
          }
        });
    }

    let results = [];

    if (members.length > 0) {
      switch (type) {
        case 'playtime':
          message.channel.startTyping();
          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  uplay_id = res[0].uplay_id;
                  platform = res[0].platform;
                  agent_name = res[0].agent_name;
                  playerData = await getPlayerData(
                    uplay_id,
                    platform,
                    agent_name,
                  );

                  if (lodash.isEmpty(playerData) == false) {
                    results.push({
                      is_manual: false,
                      uplay_id: playerData.name,
                      user_id: members[i].id,
                      username: members[i].username,
                      ranked_value: Number(playerData.timeplayed_total),
                      display_value:
                        lodash.round(playerData.timeplayed_total / 3600) +
                        ' hour' +
                        (lodash.round(playerData.timeplayed_total / 3600) > 1
                          ? 's'
                          : ''),
                    });
                  }
                }
              });
          }

          for (var i = 0; i < manual_agents.length; i++) {
            playerData = await getPlayerData(
              manual_agents[i],
              server_platform,
              manual_agents[i],
            );

            if (lodash.isEmpty(playerData) == false) {
              results.push({
                is_manual: true,
                uplay_id: playerData.name,
                user_id: 0,
                username: playerData.name,
                ranked_value: Number(playerData.timeplayed_total),
                display_value:
                  lodash.round(playerData.timeplayed_total / 3600) +
                  ' hour' +
                  (lodash.round(playerData.timeplayed_total / 3600) > 1
                    ? 's'
                    : ''),
              });
            } else {
              if (useTrackerGG)
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
              else
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
            }
          }
          message.channel.stopTyping();

          if (results.length > 0) {
            printRankedResult(message, results, 'desc', 'Playtime');
          }
          break;
        case 'ecredit':
          message.channel.startTyping();
          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  uplay_id = res[0].uplay_id;
                  platform = res[0].platform;
                  agent_name = res[0].agent_name;
                  playerData = await getPlayerData(
                    uplay_id,
                    platform,
                    agent_name,
                  );

                  if (lodash.isEmpty(playerData) == false) {
                    results.push({
                      is_manual: false,
                      uplay_id: playerData.name,
                      user_id: members[i].id,
                      username: members[i].username,
                      ranked_value: Number(playerData.ecredits),
                      display_value: playerData.ecredits.toLocaleString(),
                    });
                  }
                }
              });
          }

          for (var i = 0; i < manual_agents.length; i++) {
            playerData = await getPlayerData(
              manual_agents[i],
              server_platform,
              manual_agents[i],
            );

            if (lodash.isEmpty(playerData) == false) {
              results.push({
                is_manual: true,
                uplay_id: playerData.name,
                user_id: 0,
                username: playerData.name,
                ranked_value: Number(playerData.ecredits),
                display_value: playerData.ecredits.toLocaleString(),
              });
            } else {
              if (useTrackerGG)
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
              else
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
            }
          }
          message.channel.stopTyping();

          if (results.length > 0) {
            printRankedResult(message, results, 'desc', 'E-Credit Balance');
          }
          break;
        case 'gearscore':
          message.channel.startTyping();
          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  uplay_id = res[0].uplay_id;
                  platform = res[0].platform;
                  agent_name = res[0].agent_name;
                  playerData = await getPlayerData(
                    uplay_id,
                    platform,
                    agent_name,
                  );

                  if (lodash.isEmpty(playerData) == false) {
                    results.push({
                      is_manual: false,
                      uplay_id: playerData.name,
                      user_id: members[i].id,
                      username: members[i].username,
                      ranked_value: Number(playerData.gearscore),
                      display_value: playerData.gearscore,
                    });
                  }
                }
              });
          }

          for (var i = 0; i < manual_agents.length; i++) {
            playerData = await getPlayerData(
              manual_agents[i],
              server_platform,
              manual_agents[i],
            );

            if (lodash.isEmpty(playerData) == false) {
              results.push({
                is_manual: true,
                uplay_id: playerData.name,
                user_id: 0,
                username: playerData.name,
                ranked_value: Number(playerData.gearscore),
                display_value: playerData.gearscore,
              });
            } else {
              if (useTrackerGG)
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
              else
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
            }
          }
          message.channel.stopTyping();

          if (results.length > 0) {
            printRankedResult(message, results, 'desc', 'Gear Score');
          }
          break;
        case 'commendation':
          message.channel.startTyping();
          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  uplay_id = res[0].uplay_id;
                  platform = res[0].platform;
                  agent_name = res[0].agent_name;
                  playerData = await getPlayerData(
                    uplay_id,
                    platform,
                    agent_name,
                  );

                  if (lodash.isEmpty(playerData) == false) {
                    results.push({
                      is_manual: false,
                      uplay_id: playerData.name,
                      user_id: members[i].id,
                      username: members[i].username,
                      ranked_value: Number(playerData.commendations),
                      display_value: playerData.commendations.toLocaleString(),
                    });
                  }
                }
              });
          }

          for (var i = 0; i < manual_agents.length; i++) {
            playerData = await getPlayerData(
              manual_agents[i],
              server_platform,
              manual_agents[i],
            );

            if (lodash.isEmpty(playerData) == false) {
              results.push({
                is_manual: true,
                uplay_id: playerData.name,
                user_id: 0,
                username: playerData.name,
                ranked_value: Number(playerData.commendations),
                display_value: playerData.commendations.toLocaleString(),
              });
            } else {
              if (useTrackerGG)
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
              else
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
            }
          }
          message.channel.stopTyping();

          if (results.length > 0) {
            printRankedResult(message, results, 'desc', 'Commendations');
          }
          break;

        case 'clanexp':
        case 'cxp':
          message.channel.startTyping();
          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  uplay_id = res[0].uplay_id;
                  platform = res[0].platform;
                  agent_name = res[0].agent_name;
                  playerData = await getPlayerData(
                    uplay_id,
                    platform,
                    agent_name,
                  );

                  if (lodash.isEmpty(playerData) == false) {
                    results.push({
                      is_manual: false,
                      uplay_id: playerData.name,
                      user_id: members[i].id,
                      username: members[i].username,
                      ranked_value: Number(playerData.xp_clan),
                      display_value: playerData.xp_clan.toLocaleString(),
                    });
                  }
                }
              });
          }

          for (var i = 0; i < manual_agents.length; i++) {
            playerData = await getPlayerData(
              manual_agents[i],
              server_platform,
              manual_agents[i],
            );

            if (lodash.isEmpty(playerData) == false) {
              results.push({
                is_manual: true,
                uplay_id: playerData.name,
                user_id: 0,
                username: playerData.name,
                ranked_value: Number(playerData.xp_clan),
                display_value: playerData.xp_clan.toLocaleString(),
              });
            } else {
              if (useTrackerGG)
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
              else
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
            }
          }
          message.channel.stopTyping();

          if (results.length > 0) {
            printRankedResult(message, results, 'desc', 'Clan EXP');
          }
          break;

        case 'clanexp24h':
        case 'cxp24h':
          message.channel.startTyping();
          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  uplay_id = res[0].uplay_id;
                  platform = res[0].platform;
                  agent_name = res[0].agent_name;
                  playerData = await getPlayerData(
                    uplay_id,
                    platform,
                    agent_name,
                  );

                  if (lodash.isEmpty(playerData) == false) {
                    results.push({
                      is_manual: false,
                      uplay_id: playerData.name,
                      user_id: members[i].id,
                      username: members[i].username,
                      ranked_value: playerData.xp_clan_24h
                        ? Number(playerData.xp_clan_24h)
                        : 0,
                      display_value: playerData.xp_clan_24h
                        ? playerData.xp_clan_24h.toLocaleString()
                        : 0,
                    });
                  }
                }
              });
          }

          for (var i = 0; i < manual_agents.length; i++) {
            playerData = await getPlayerData(
              manual_agents[i],
              server_platform,
              manual_agents[i],
            );

            if (lodash.isEmpty(playerData) == false) {
              results.push({
                is_manual: true,
                uplay_id: playerData.name,
                user_id: 0,
                username: playerData.name,
                ranked_value: playerData.xp_clan_24h
                  ? Number(playerData.xp_clan_24h)
                  : 0,
                display_value: playerData.xp_clan_24h
                  ? playerData.xp_clan_24h.toLocaleString()
                  : 0,
              });
            } else {
              if (useTrackerGG)
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
              else
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
            }
          }
          message.channel.stopTyping();

          if (results.length > 0) {
            printRankedResult(message, results, 'desc', '24 Hours Clan EXP');
          }
          break;

        case 'clanexp7d':
        case 'cxp7d':
          message.channel.startTyping();
          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  uplay_id = res[0].uplay_id;
                  platform = res[0].platform;
                  agent_name = res[0].agent_name;
                  playerData = await getPlayerData(
                    uplay_id,
                    platform,
                    agent_name,
                  );

                  if (lodash.isEmpty(playerData) == false) {
                    results.push({
                      is_manual: false,
                      uplay_id: playerData.name,
                      user_id: members[i].id,
                      username: members[i].username,
                      ranked_value: playerData.xp_clan_7d
                        ? Number(playerData.xp_clan_7d)
                        : 0,
                      display_value: playerData.xp_clan_7d
                        ? playerData.xp_clan_7d.toLocaleString()
                        : 0,
                    });
                  }
                }
              });
          }

          for (var i = 0; i < manual_agents.length; i++) {
            playerData = await getPlayerData(
              manual_agents[i],
              server_platform,
              manual_agents[i],
            );

            if (lodash.isEmpty(playerData) == false) {
              results.push({
                is_manual: true,
                uplay_id: playerData.name,
                user_id: 0,
                username: playerData.name,
                ranked_value: playerData.xp_clan_7d
                  ? Number(playerData.xp_clan_7d)
                  : 0,
                display_value: playerData.xp_clan_7d
                  ? playerData.xp_clan_7d.toLocaleString()
                  : 0,
              });
            } else {
              if (useTrackerGG)
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
              else
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
            }
          }
          message.channel.stopTyping();

          if (results.length > 0) {
            printRankedResult(message, results, 'desc', '7 Days Clan EXP');
          }
          break;

        case 'clanexp30d':
        case 'cxp30d':
          message.channel.startTyping();
          for (var i = 0; i < members.length; i++) {
            await pool
              .query('SELECT * FROM users WHERE user_id = ?', [members[i].id])
              .then(async function (res) {
                if (res.length > 0) {
                  uplay_id = res[0].uplay_id;
                  platform = res[0].platform;
                  agent_name = res[0].agent_name;
                  playerData = await getPlayerData(
                    uplay_id,
                    platform,
                    agent_name,
                  );

                  if (lodash.isEmpty(playerData) == false) {
                    results.push({
                      is_manual: false,
                      uplay_id: playerData.name,
                      user_id: members[i].id,
                      username: members[i].username,
                      ranked_value: playerData.xp_clan_30d
                        ? Number(playerData.xp_clan_30d)
                        : 0,
                      display_value: playerData.xp_clan_30d
                        ? playerData.xp_clan_30d.toLocaleString()
                        : 0,
                    });
                  }
                }
              });
          }

          for (var i = 0; i < manual_agents.length; i++) {
            playerData = await getPlayerData(
              manual_agents[i],
              server_platform,
              manual_agents[i],
            );

            if (lodash.isEmpty(playerData) == false) {
              results.push({
                is_manual: true,
                uplay_id: playerData.name,
                user_id: 0,
                username: playerData.name,
                ranked_value: playerData.xp_clan_30d
                  ? Number(playerData.xp_clan_30d)
                  : 0,
                display_value: playerData.xp_clan_30d
                  ? playerData.xp_clan_30d.toLocaleString()
                  : 0,
              });
            } else {
              if (useTrackerGG)
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
              else
                pool.query(
                  'DELETE FROM server_agents WHERE agent_name = ? AND server_id = ?',
                  [manual_agents[i], message.guild.id],
                );
            }
          }
          message.channel.stopTyping();

          if (results.length > 0) {
            printRankedResult(message, results, 'desc', '30 Days Clan EXP');
          }
          break;
      }
    }
  });
}

function printRankedResult(message, results, order, title) {
  let limit = 10;
  let hashid = new Hashids('ISAC_BOT', 6, 'abcdefghijklmnopqrstuvwxyz'); // pad to length 10
  let hash = hashid.encode(message.logCommandID);
  let url = 'https://results.isacbot.gg/?hash=' + hash;
  let showMore = results.length > limit ? true : false;

  display_results = lodash
    .sortBy(results, ['ranked_value'])
    .reverse()
    .slice(0, limit);

  // check if manually added agent already exists in server and remove if yes
  for (var i = 0; i < display_results.length; i++) {
    let curr_uplay_id = display_results[i].uplay_id;

    if (
      display_results[i].is_manual &&
      display_results.filter(function (result) {
        return result.uplay_id === curr_uplay_id;
      }).length > 1
    ) {
      display_results[i].skip = true;
      pool.query(
        'DELETE FROM server_agents WHERE server_id = ? AND agent_name = ?',
        [message.guild.id, display_results[i].uplay_id],
      );
    } else display_results[i].skip = false;
  }

  // filter repeat agents
  display_results = display_results.filter(function (result) {
    return result.skip == false;
  });

  let embed = new Discord.MessageEmbed()
    .setTitle(
      'The Division 2 - Server Ranking for ' + message.channel.guild.name,
    )
    .setColor('#339af0')
    .setFooter(embedFooter, embedFooterImg);

  let rankingStr = '';
  let manualAgentExist = false;

  for (var i = 0; i < display_results.length; i++) {
    if (display_results[i].is_manual) {
      rankingStr +=
        i +
        1 +
        '. ' +
        display_results[i].uplay_id.replace('_', '\\_') +
        '\\*\\*\\* _(' +
        display_results[i].display_value +
        ')_\n';
      manualAgentExist = true;
    } else
      rankingStr +=
        i +
        1 +
        '. ' +
        display_results[i].uplay_id.replace('_', '\\_') +
        ' _(' +
        display_results[i].display_value +
        ')_ <@' +
        display_results[i].user_id +
        '>\n';
  }

  if (showMore) {
    rankingStr += '\nto see full results ';
    embed.setURL(url);
    rankingStr += '[**click here.**](' + url + ')';
  }

  if (manualAgentExist) {
    rankingStr += '\n\\*\\*\\* indicates manually added agents.';
  }

  embed.addField(title, rankingStr);

  message.channel
    .send(embed)
    .then(function (msg) {
      if (message.autoDelete) msg.delete({timeout: 15000});
    })
    .catch(function (err) {
      if (err.code == 50013) {
        message.author.send(MISSING_PERMISSION_ERR);
      }
      console.log(err);
    });

  helper.saveLogCommandResult(message.logCommandID, results);
}

function printAgentStat(message, playerData) {
  let embed = new Discord.MessageEmbed()
    .setTitle(
      'The Division 2 - Agent Stats: ' +
        playerData.name +
        ' (' +
        playerData.platform +
        ')',
    )
    .setColor('#FF6D10')
    .setThumbnail(message.author.avatarURL())
    .addField('Level', playerData.level_pve, true)
    .addField('DZ Rank', playerData.level_dz, true)
    .addField('Conflict Rank', playerData.level_pvp, true)

    .addField(
      'Specialization',
      lodash.capitalize(playerData.specialization),
      true,
    )
    .addField('Gear Score', playerData.gearscore, true)
    .addField('Items Looted', playerData.looted.toLocaleString(), true)

    .addField(
      'PvE Playtime',
      lodash.round(playerData.timeplayed_pve / 3600) +
        ' hour' +
        (lodash.round(playerData.timeplayed_pve / 3600) > 1 ? 's' : ''),
      true,
    )
    .addField(
      'DZ Playtime',
      lodash.round(playerData.timeplayed_dz / 3600) +
        ' hour' +
        (lodash.round(playerData.timeplayed_dz / 3600) > 1 ? 's' : ''),
      true,
    )
    .addField(
      'PvP Playtime',
      lodash.round(playerData.timeplayed_pvp / 3600) +
        ' hour' +
        (lodash.round(playerData.timeplayed_pvp / 3600) > 1 ? 's' : ''),
      true,
    )

    //.addField("DZ Rogue Playtime", lodash.round(playerData.timeplayed_rogue / 3600) + "h", true)

    .addField('Total Kills', playerData.kills_total.toLocaleString(), true)
    .addField(
      'Specialization Kills',
      playerData.kills_specialization.toLocaleString(),
      true,
    )
    .addField(
      'Headshot Kills',
      playerData.kills_headshot.toLocaleString() +
        ' (' +
        lodash.round(
          (playerData.kills_headshot / playerData.kills_total) * 100,
        ) +
        '%)',
      true,
    )
    .addField(
      'Skill Kills',
      playerData.kills_skill.toLocaleString() +
        ' (' +
        lodash.round((playerData.kills_skill / playerData.kills_total) * 100) +
        '%)',
      true,
    )

    .addField('Clan EXP', playerData.xp_clan.toLocaleString(), true)
    .addField('Commendations', playerData.commendations.toLocaleString(), true)
    .addField('E-Credits', playerData.ecredits.toLocaleString(), true)

    // .addField("Last Login (UTC)", moment.unix(playerData.lastlogin).utc().format('D MMM YYYY'), true)

    .setFooter(embedFooter, embedFooterImg);

  message.channel
    .send(embed)
    .then(function (msg) {
      if (message.autoDelete) msg.delete({timeout: 15000});
    })
    .catch(function (err) {
      if (err.code == 50013) {
        message.author.send(MISSING_PERMISSION_ERR);
      }
      console.log(err);
    });

  helper.saveLogCommandResult(message.logCommandID, playerData);
}

async function printAgentEXP(message, playerData) {
  let embed = new Discord.MessageEmbed()
    .setTitle(
      'The Division 2 - Agent EXP: ' +
        playerData.name +
        ' (' +
        playerData.platform +
        ')',
    )
    .setColor('#FF6D10')
    .setThumbnail(message.author.avatarURL())
    .addField('Clan EXP', playerData.xp_clan.toLocaleString(), true)
    .addField('PvE EXP', playerData.xp_ow.toLocaleString(), true)
    .addField('Dark Zone EXP', playerData.xp_dz.toLocaleString(), true)

    .addField(
      '24h Clan EXP',
      playerData.xp_clan_24h ? playerData.xp_clan_24h.toLocaleString() : 0,
      true,
    )
    .addField(
      '7d Clan EXP',
      playerData.xp_clan_7d ? playerData.xp_clan_7d.toLocaleString() : 0,
      true,
    )
    .addField(
      '30d Clan EXP',
      playerData.xp_clan_30d ? playerData.xp_clan_30d.toLocaleString() : 0,
      true,
    )

    .setFooter(embedFooter, embedFooterImg);

  message.channel
    .send(embed)
    .then(function (msg) {
      if (message.autoDelete) msg.delete({timeout: 15000});
    })
    .catch(function (err) {
      if (err.code == 50013) {
        message.author.send(MISSING_PERMISSION_ERR);
      }
      console.log(err);
    });

  helper.saveLogCommandResult(message.logCommandID, playerData);
}
