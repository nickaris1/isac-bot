import {Platform} from './enums';

export const UNABLE_TO_FIND_AGENT_ERR =
  'Error: Unable to locate Agent `%AGENT_NAME%` on platform `%SERVER_PLATFORM%`.'; // 1
export const AGENT_REGISTRATION_NOT_FOUND_ERR =
  'Error: Agent registration not found. Register with `!register agent_id`'; // 2
export const INVALID_LEADERBOARD_TYPE_ERR =
  'Error: Please enter a valid leaderboard. \nOptions available: _' +
  rankedData.join(', ') +
  '_'; // 3
export const INVALID_PLATFORM_TYPE_ERR =
  'Error: Please enter a valid platform. \nOptions available: _' +
  Object.values(Platform).join(', ') +
  '_'; // 4
export const NOT_ADMIN_PERMISSION_ERR =
  'Error: This command is only valid for server admins of `%SERVER_NAME%`.'; // 5
export const MISSING_PERMISSION_ERR =
  'Error: The bot is missing permissions required to send a reply to the channel.'; // 6
export const ROLE_NOT_FOUND_ERR =
  'Error: The role `%ROLE_ARG%` does not exist.'; // 7
export const INVALID_AUTO_DELETE_TYPE_ERR =
  'Error: Please enter a valid auto delete option. \nOptions available: _on, off_'; // 8
