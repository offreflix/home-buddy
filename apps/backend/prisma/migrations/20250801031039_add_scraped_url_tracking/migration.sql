-- CreateTable
CREATE TABLE "ScrapedUrl" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "urlHash" TEXT NOT NULL,
    "supermarket" TEXT,
    "total" TEXT,
    "nfcKey" TEXT,
    "scrapedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "ScrapedUrl_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedUrl_urlHash_key" ON "ScrapedUrl"("urlHash");

-- CreateIndex
CREATE INDEX "ScrapedUrl_userId_idx" ON "ScrapedUrl"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ScrapedUrl_urlHash_userId_key" ON "ScrapedUrl"("urlHash", "userId");

-- AddForeignKey
ALTER TABLE "ScrapedUrl" ADD CONSTRAINT "ScrapedUrl_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
