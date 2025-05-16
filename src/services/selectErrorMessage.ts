import {
  AGENT_REGISTRATION_NOT_FOUND_ERR,
  INVALID_AUTO_DELETE_TYPE_ERR,
  INVALID_LEADERBOARD_TYPE_ERR,
  INVALID_PLATFORM_TYPE_ERR,
  MISSING_PERMISSION_ERR,
  NOT_ADMIN_PERMISSION_ERR,
  ROLE_NOT_FOUND_ERR,
  UNABLE_TO_FIND_AGENT_ERR,
} from '@/src/utils/errors';

export function getErrorMessage(
  err_code: number,
  details = {username: '', server_platform: '', server_name: '', role: ''},
) {
  switch (err_code) {
    case 1:
      return UNABLE_TO_FIND_AGENT_ERR.replace(
        '%AGENT_NAME%',
        details.username,
      ).replace('%SERVER_PLATFORM%', details.server_platform);
    case 2:
      return AGENT_REGISTRATION_NOT_FOUND_ERR;
    case 3:
      return INVALID_LEADERBOARD_TYPE_ERR;
    case 4:
      return INVALID_PLATFORM_TYPE_ERR;
    case 5:
      return NOT_ADMIN_PERMISSION_ERR.replace(
        '%SERVER_NAME%',
        details.server_name,
      );
    case 6:
      return MISSING_PERMISSION_ERR;
    case 7:
      return ROLE_NOT_FOUND_ERR.replace('%ROLE_ARG%', details.role);
    case 8:
      return INVALID_AUTO_DELETE_TYPE_ERR;
    default:
      return '';
  }
}
