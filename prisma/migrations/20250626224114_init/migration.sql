/*
  Warnings:

  - You are about to drop the `attendance` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `payment` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profile` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `turnout` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_memberid_fkey";

-- DropForeignKey
ALTER TABLE "attendance" DROP CONSTRAINT "attendance_turnoutid_fkey";

-- DropForeignKey
ALTER TABLE "payment" DROP CONSTRAINT "payment_memberid_fkey";

-- DropForeignKey
ALTER TABLE "profile" DROP CONSTRAINT "profile_memberid_fkey";

-- DropTable
DROP TABLE "attendance";

-- DropTable
DROP TABLE "members";

-- DropTable
DROP TABLE "payment";

-- DropTable
DROP TABLE "profile";

-- DropTable
DROP TABLE "turnout";
