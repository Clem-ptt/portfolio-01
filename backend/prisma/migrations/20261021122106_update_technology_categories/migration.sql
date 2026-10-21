/*
  Warnings:

  - The values [DEVOPS] on the enum `TechnologyCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "TechnologyCategory_new" AS ENUM ('PROGRAMMING_LANGUAGES', 'FRONTEND', 'BACKEND', 'DATABASE', 'CLOUD_DEVOPS', 'TOOLS', 'AI_AUTOMATION', 'SECURITY_INFRASTRUCTURE', 'DESIGN', 'TESTING_QA', 'OTHER');
ALTER TABLE "Technology" ALTER COLUMN "category" TYPE "TechnologyCategory_new" USING ("category"::text::"TechnologyCategory_new");
ALTER TYPE "TechnologyCategory" RENAME TO "TechnologyCategory_old";
ALTER TYPE "TechnologyCategory_new" RENAME TO "TechnologyCategory";
DROP TYPE "public"."TechnologyCategory_old";
COMMIT;
