import {SlashCommandBuilder, ChatInputCommandInteraction} from 'discord.js';
const txt =
  '***BOT COMMANDS***\n' +
  '\n**1. Register**: `!register agent_id`\n' +
  '**2. Agent Stats**: `!agent agent_id`\n' +
  '**3. Dark Zone Stats**: `!dz agent_id`\n' +
  '**4. PvE Stats:** `!pve agent_id`\n' +
  '**5. Weapons Stats**: `!weapons agent_id`\n' +
  '**6. EXP Summary**: `!exp agent_id`\n' +
  '**7. Server Rankings**: `!rank [ playtime | ecredit | gearscore | commendation | clanexp | clanexp24h | clanexp7d | clanexp30d ]`\n' +
  "**8. Change Server's Platform (default: uplay, admin)**: `!platform [ uplay | psn | xbl ]`\n" +
  '**9. Clan Role (admin)**: `!clan role server_role_case_sensitive`\n' +
  '**10. Remove Clan Role (admin)**: `!clan removerole`\n' +
  '**11. Manually Add/Remove agent(s) to clan (admin)**: `!clan add/remove agent_id`\n' +
  '**12. View Manually Added Agents (admin)**: `!clan list`\n' +
  '**13. Change Prefix (admin)**: `!isac prefix desired_prefix`\n' +
  '**14. Donation Link**: `!donate`\n' +
  '\n***NEW COMMANDS***\n' +
  '**15. Auto Delete**: `!autodelete on/off`\n' +
  '**16. Update Nicknames to their agent name**: `!update_nicknames`\n' +
  '\n*1. admin(s) must have either `manage channels` or `administrator` permission(s).*\n' +
  "*2. Auto Deletion need `Manage Messages` permission and will delete both author's and bot's messages in 15 seconds.*\n" +
  "*3. Update Nicknames need `Manage Nicknames` permission and will mass update whoever's nicknames that are registered with ISAC.*\n" +
  '*4. setting a clan role with the bot will make `!rank` command to filter members only from that role, everyone else will be left out.*\n' +
  '\n*https://isacbot.gg/#commands*';

export default {
  data: new SlashCommandBuilder().setName('status'),
  execute: async (interaction: ChatInputCommandInteraction) => {
    await interaction.reply(txt);
  },
};
