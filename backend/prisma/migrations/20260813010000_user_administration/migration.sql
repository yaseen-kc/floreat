-- Expand/backfill-safe user administration migration.
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'DEACTIVATED');
ALTER TABLE "User" ADD COLUMN "status" "UserStatus";
UPDATE "User" SET "status" = 'ACTIVE' WHERE "status" IS NULL;
ALTER TABLE "User" ALTER COLUMN "status" SET DEFAULT 'ACTIVE', ALTER COLUMN "status" SET NOT NULL;

CREATE TYPE "UserInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REVOKED', 'EXPIRED');
CREATE TABLE "UserInvitation" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "clerkInvitationId" TEXT NOT NULL,
  "role" "Role" NOT NULL,
  "invitedById" TEXT NOT NULL,
  "status" "UserInvitationStatus" NOT NULL DEFAULT 'PENDING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "acceptedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  CONSTRAINT "UserInvitation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "UserInvitation_clerkInvitationId_key" UNIQUE ("clerkInvitationId"),
  CONSTRAINT "UserInvitation_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("clerkId") ON DELETE RESTRICT ON UPDATE CASCADE
);
CREATE INDEX "UserInvitation_email_status_idx" ON "UserInvitation"("email", "status");
CREATE INDEX "UserInvitation_status_createdAt_idx" ON "UserInvitation"("status", "createdAt");
