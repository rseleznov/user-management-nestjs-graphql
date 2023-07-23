-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "roles" "Role"[] DEFAULT ARRAY['USER']::"Role"[];
