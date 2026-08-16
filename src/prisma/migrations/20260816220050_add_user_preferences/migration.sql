-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isOnboarded" BOOLEAN DEFAULT false,
ADD COLUMN     "preferences" JSONB DEFAULT '{}',
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "authProvider" SET DEFAULT 'LOCAL';
