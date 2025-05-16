async function getMentionedUserAgentID(client: PrismaClient, userId: string) {
  return client.user
    .findFirst({
      where: {
        userId,
      },
      select: {
        agentName: true,
      },
    })
    .then(u => u?.agentName);
}
