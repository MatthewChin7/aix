-- CreateTable
CREATE TABLE "Company" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "url" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "products" TEXT NOT NULL DEFAULT '',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "newExhibitor" BOOLEAN NOT NULL DEFAULT false,
    "sponsoring" TEXT NOT NULL DEFAULT '',
    "numberOfEmployees" TEXT NOT NULL DEFAULT '',
    "marketCap" TEXT NOT NULL DEFAULT '',
    "additionalInfo" TEXT NOT NULL DEFAULT '',
    "status" TEXT NOT NULL DEFAULT 'NONE',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
