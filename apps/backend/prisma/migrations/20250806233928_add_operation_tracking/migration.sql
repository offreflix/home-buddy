/*
  Warnings:

  - You are about to drop the `ScrapedUrl` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('SCRAPING_ONLY', 'SCRAPING_MATCHING', 'MATCHING_ONLY');

-- CreateEnum
CREATE TYPE "OperationStatus" AS ENUM ('RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- DropForeignKey
ALTER TABLE "ScrapedUrl" DROP CONSTRAINT "ScrapedUrl_userId_fkey";

-- DropTable
DROP TABLE "ScrapedUrl";

-- CreateTable
CREATE TABLE "OperationLog" (
    "id" SERIAL NOT NULL,
    "jobId" TEXT NOT NULL,
    "userId" INTEGER,
    "operationType" "OperationType" NOT NULL,
    "status" "OperationStatus" NOT NULL DEFAULT 'RUNNING',
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endTime" TIMESTAMP(3),
    "duration" INTEGER,
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OperationLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScrapingLog" (
    "id" SERIAL NOT NULL,
    "operationId" INTEGER NOT NULL,
    "url" TEXT NOT NULL,
    "inputData" JSONB NOT NULL,
    "outputData" JSONB,
    "httpStatus" INTEGER,
    "responseTime" INTEGER,
    "errorDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ScrapingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MatchingLog" (
    "id" SERIAL NOT NULL,
    "operationId" INTEGER NOT NULL,
    "inputProducts" JSONB NOT NULL,
    "matcherRequest" JSONB NOT NULL,
    "matcherResponse" JSONB,
    "matchCount" INTEGER,
    "unmatchCount" INTEGER,
    "responseTime" INTEGER,
    "errorDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MatchingLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LLMLog" (
    "id" SERIAL NOT NULL,
    "operationId" INTEGER NOT NULL,
    "provider" TEXT NOT NULL DEFAULT 'openai',
    "model" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT,
    "promptTokens" INTEGER,
    "responseTokens" INTEGER,
    "totalTokens" INTEGER,
    "cost" DOUBLE PRECISION,
    "temperature" DOUBLE PRECISION,
    "responseTime" INTEGER,
    "errorDetails" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LLMLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OperationLog_jobId_key" ON "OperationLog"("jobId");

-- CreateIndex
CREATE INDEX "OperationLog_jobId_idx" ON "OperationLog"("jobId");

-- CreateIndex
CREATE INDEX "OperationLog_userId_idx" ON "OperationLog"("userId");

-- CreateIndex
CREATE INDEX "OperationLog_operationType_idx" ON "OperationLog"("operationType");

-- CreateIndex
CREATE INDEX "OperationLog_status_idx" ON "OperationLog"("status");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapingLog_operationId_key" ON "ScrapingLog"("operationId");

-- CreateIndex
CREATE UNIQUE INDEX "MatchingLog_operationId_key" ON "MatchingLog"("operationId");

-- CreateIndex
CREATE INDEX "LLMLog_operationId_idx" ON "LLMLog"("operationId");

-- CreateIndex
CREATE INDEX "LLMLog_provider_idx" ON "LLMLog"("provider");

-- CreateIndex
CREATE INDEX "LLMLog_model_idx" ON "LLMLog"("model");

-- AddForeignKey
ALTER TABLE "OperationLog" ADD CONSTRAINT "OperationLog_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScrapingLog" ADD CONSTRAINT "ScrapingLog_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "OperationLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MatchingLog" ADD CONSTRAINT "MatchingLog_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "OperationLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LLMLog" ADD CONSTRAINT "LLMLog_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "OperationLog"("id") ON DELETE CASCADE ON UPDATE CASCADE;
