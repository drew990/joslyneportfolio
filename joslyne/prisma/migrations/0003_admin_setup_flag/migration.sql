ALTER TABLE "AdminUser" ADD COLUMN IF NOT EXISTS "hasEnteredAccount" BOOLEAN NOT NULL DEFAULT false;

UPDATE "AdminUser"
SET "hasEnteredAccount" = true
WHERE "passwordHash" IS NOT NULL AND "passwordHash" <> '';
