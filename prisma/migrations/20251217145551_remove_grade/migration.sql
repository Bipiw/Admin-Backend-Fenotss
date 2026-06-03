/*
  Warnings:

  - You are about to drop the column `gradeLevel` on the `AcademicRecord` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AcademicRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "remarks" TEXT,
    "memberId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AcademicRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_AcademicRecord" ("createdAt", "id", "memberId", "remarks", "status", "updatedAt", "year") SELECT "createdAt", "id", "memberId", "remarks", "status", "updatedAt", "year" FROM "AcademicRecord";
DROP TABLE "AcademicRecord";
ALTER TABLE "new_AcademicRecord" RENAME TO "AcademicRecord";
CREATE INDEX "AcademicRecord_memberId_idx" ON "AcademicRecord"("memberId");
CREATE INDEX "AcademicRecord_year_idx" ON "AcademicRecord"("year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
