import {PrismaClient as PClient} from '@prisma/client';

function prismaClientGenerator() {
  return new PClient().$extends({
    query: {
      $allModels: {
        updateMany: async ({args, query}) => {
          if (args.where === undefined || !Object.keys(args.where).length) {
            throw new Error('No where clause');
          }
          return query(args);
        },
        deleteMany: async ({args, query}) => {
          if (args.where === undefined || !Object.keys(args.where).length) {
            throw new Error('No where clause');
          }
          return query(args);
        },
      },
    },
  }) as PClient;
}

let prisma = prismaClientGenerator();

export async function executeWithPrisma<T>(
  callback: (client: PrismaClient) => Promise<T>,
  atomic: boolean = false,
  timeout?: number,
) {
  if (atomic)
    return await prisma.$transaction(callback, {
      timeout: timeout ?? 5000,
    });
  return await callback(prisma);
}
