type PrismaClient = Omit<
  import('@prisma/client').PrismaClient,
  import('@prisma/client/runtime/library').ITXClientDenyList
>;
