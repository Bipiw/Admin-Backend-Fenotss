-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "StudyMaterial" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FinancialRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "amount" DECIMAL NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "description" TEXT,
    "receiptRef" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "memberId" TEXT NOT NULL,
    "recordedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "FinancialRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "FinancialRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_FinancialRecord" ("amount", "createdAt", "date", "description", "id", "memberId", "recordedById", "status", "type", "updatedAt") SELECT "amount", "createdAt", "date", "description", "id", "memberId", "recordedById", "status", "type", "updatedAt" FROM "FinancialRecord";
DROP TABLE "FinancialRecord";
ALTER TABLE "new_FinancialRecord" RENAME TO "FinancialRecord";
CREATE INDEX "FinancialRecord_memberId_idx" ON "FinancialRecord"("memberId");
CREATE INDEX "FinancialRecord_status_idx" ON "FinancialRecord"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
