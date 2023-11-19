-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShopSettings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "temperature" REAL NOT NULL DEFAULT 0.25,
    "shopId" TEXT NOT NULL
);
INSERT INTO "new_ShopSettings" ("id", "shopId", "temperature") SELECT "id", "shopId", "temperature" FROM "ShopSettings";
DROP TABLE "ShopSettings";
ALTER TABLE "new_ShopSettings" RENAME TO "ShopSettings";
CREATE UNIQUE INDEX "ShopSettings_shopId_key" ON "ShopSettings"("shopId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
