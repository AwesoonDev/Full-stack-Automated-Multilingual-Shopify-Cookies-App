-- CreateTable
CREATE TABLE "ShopSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "temperature" REAL NOT NULL,
    "shopId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "ShopCountryView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "shopId" TEXT NOT NULL,
    CONSTRAINT "ShopCountryView_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "ShopSettings" ("shopId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "ShopSettings_shopId_key" ON "ShopSettings"("shopId");
