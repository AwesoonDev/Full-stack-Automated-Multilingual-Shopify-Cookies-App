/*
  Warnings:

  - You are about to drop the column `onboarded` on the `ShopSettings` table. All the data in the column will be lost.
  - You are about to drop the column `temperature` on the `ShopSettings` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShopSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "shopId" TEXT NOT NULL,
    "personality" TEXT NOT NULL DEFAULT 'business'
);
INSERT INTO "new_ShopSettings" ("id", "shopId") SELECT "id", "shopId" FROM "ShopSettings";
DROP TABLE "ShopSettings";
ALTER TABLE "new_ShopSettings" RENAME TO "ShopSettings";
CREATE UNIQUE INDEX "ShopSettings_shopId_key" ON "ShopSettings"("shopId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
