-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_ShopCountryView" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "country" TEXT NOT NULL,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "acceptanceCount" INTEGER NOT NULL DEFAULT 0,
    "shopId" TEXT NOT NULL,
    CONSTRAINT "ShopCountryView_shopId_fkey" FOREIGN KEY ("shopId") REFERENCES "ShopSettings" ("shopId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_ShopCountryView" ("country", "id", "shopId", "viewCount") SELECT "country", "id", "shopId", "viewCount" FROM "ShopCountryView";
DROP TABLE "ShopCountryView";
ALTER TABLE "new_ShopCountryView" RENAME TO "ShopCountryView";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
