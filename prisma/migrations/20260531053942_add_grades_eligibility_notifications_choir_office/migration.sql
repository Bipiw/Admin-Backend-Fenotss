-- CreateTable
CREATE TABLE "ServiceEligibility" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "reason" TEXT,
    "attendanceRate" REAL,
    "financeRate" REAL,
    "academicScore" REAL,
    "computedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,
    "overriddenById" TEXT,
    "overrideReason" TEXT,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "ServiceEligibility_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ServiceEligibility_overriddenById_fkey" FOREIGN KEY ("overriddenById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MemberNotification" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'INFO',
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "memberId" TEXT NOT NULL,
    "sentById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "MemberNotification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MemberNotification_sentById_fkey" FOREIGN KEY ("sentById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ClearanceRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "reason" TEXT NOT NULL,
    "notes" TEXT,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "memberId" TEXT NOT NULL,
    "issuedById" TEXT NOT NULL,
    CONSTRAINT "ClearanceRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ClearanceRecord_issuedById_fkey" FOREIGN KEY ("issuedById") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_AcademicRecord" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "year" INTEGER NOT NULL,
    "semester" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ENROLLED',
    "remarks" TEXT,
    "subjectName" TEXT,
    "examScore" REAL,
    "totalScore" REAL,
    "gradeLabel" TEXT,
    "memberId" TEXT NOT NULL,
    "recordedById" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AcademicRecord_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "MemberProfile" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "AcademicRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_AcademicRecord" ("createdAt", "id", "memberId", "remarks", "status", "updatedAt", "year") SELECT "createdAt", "id", "memberId", "remarks", "status", "updatedAt", "year" FROM "AcademicRecord";
DROP TABLE "AcademicRecord";
ALTER TABLE "new_AcademicRecord" RENAME TO "AcademicRecord";
CREATE INDEX "AcademicRecord_memberId_idx" ON "AcademicRecord"("memberId");
CREATE INDEX "AcademicRecord_year_idx" ON "AcademicRecord"("year");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ServiceEligibility_memberId_key" ON "ServiceEligibility"("memberId");

-- CreateIndex
CREATE INDEX "MemberNotification_memberId_idx" ON "MemberNotification"("memberId");
