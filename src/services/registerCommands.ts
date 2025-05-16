import {REST, Routes} from 'discord.js';
import {clientId, token} from './config.json';
import {commands} from '../data/constants';

// Construct and prepare an instance of the REST module
const rest = new REST().setToken(token);

// TODO: dynamic commands
export async function registerCommands(guildId: string) {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`,
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(clientId, guildId),
      {body: commands},
    );

    console.log(
      // @ts-ignore
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
}
