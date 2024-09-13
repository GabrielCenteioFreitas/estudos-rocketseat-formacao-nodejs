/*
  Warnings:

  - You are about to drop the column `latitude` on the `orgs` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `orgs` table. All the data in the column will be lost.
  - Added the required column `state` to the `orgs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orgs" DROP COLUMN "latitude",
DROP COLUMN "longitude",
ADD COLUMN     "state" TEXT NOT NULL;
