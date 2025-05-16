import axios from 'axios';

export async function getUpdateUserPlatforms(client: PrismaClient) {
  const users = await client.user.findMany();

  for (const {uplayId} of users) {
    const res = await axios.get(config.apiPlayerURL + uplayId);
    if (res.status === 200) {
      if (res.data.playerfound === true) {
        await client.user.updateMany({
          where: {uplayId},
          data: {agentName: res.data.name},
        });
      }
    }
  }
}
