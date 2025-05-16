CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateEnum
CREATE TYPE "PlatformType" AS ENUM ('uplay', 'psn', 'xbl');

-- CreateEnum
CREATE TYPE "AgentType" AS ENUM ('add', 'remove');

-- CreateTable
CREATE TABLE "Command" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "command" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "serverId" TEXT NOT NULL,
    "hash" TEXT NOT NULL DEFAULT '',
    "result" TEXT NOT NULL DEFAULT '',
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Command_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyExpSnapshot" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "uplayId" TEXT NOT NULL,
    "clanExp" BIGINT NOT NULL,
    "pveExp" BIGINT NOT NULL,
    "dzExp" BIGINT NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DailyExpSnapshot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Platform" (
    "id" SERIAL NOT NULL,
    "serverId" TEXT NOT NULL,
    "platform" "PlatformType" NOT NULL DEFAULT 'uplay',
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Platform_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Server" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "serverId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "prefix" TEXT NOT NULL DEFAULT '',
    "clanRoleId" TEXT NOT NULL DEFAULT '',
    "autoDelete" BOOLEAN NOT NULL DEFAULT false,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastActive" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServerAgent" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "serverId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "type" "AgentType" NOT NULL,
    "addedById" TEXT NOT NULL,
    "addedByUsername" TEXT NOT NULL,
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ServerAgent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "userId" TEXT NOT NULL,
    "uplayId" TEXT NOT NULL,
    "agentName" TEXT NOT NULL DEFAULT '',
    "platform" "PlatformType" NOT NULL DEFAULT 'uplay',
    "dateAdded" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Platform_serverId_key" ON "Platform"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "Server_serverId_key" ON "Server"("serverId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userId_key" ON "User"("userId");
