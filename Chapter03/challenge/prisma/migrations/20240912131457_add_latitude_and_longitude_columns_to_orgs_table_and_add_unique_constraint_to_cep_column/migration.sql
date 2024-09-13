/*
  Warnings:

  - A unique constraint covering the columns `[cep]` on the table `orgs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `latitude` to the `orgs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `orgs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orgs" ADD COLUMN     "latitude" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(65,30) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "orgs_cep_key" ON "orgs"("cep");
