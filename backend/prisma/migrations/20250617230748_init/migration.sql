-- CreateTable
CREATE TABLE "User" (
    "id_user" SERIAL NOT NULL,
    "nick" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "Match" (
    "id_match" SERIAL NOT NULL,
    "datetime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Match_pkey" PRIMARY KEY ("id_match")
);

-- CreateTable
CREATE TABLE "Run" (
    "id_match" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "points" INTEGER NOT NULL,
    "duration_time" INTEGER NOT NULL,

    CONSTRAINT "Run_pkey" PRIMARY KEY ("id_match","id_user")
);

-- CreateTable
CREATE TABLE "Bestiary" (
    "id_beast" SERIAL NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Bestiary_pkey" PRIMARY KEY ("id_beast")
);

-- CreateTable
CREATE TABLE "Achievements" (
    "id_achievments" SERIAL NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Achievements_pkey" PRIMARY KEY ("id_achievments")
);

-- CreateTable
CREATE TABLE "Progress" (
    "id_achievments" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL,

    CONSTRAINT "Progress_pkey" PRIMARY KEY ("id_achievments","id_user")
);

-- CreateTable
CREATE TABLE "Seen" (
    "id_beast" INTEGER NOT NULL,
    "id_user" INTEGER NOT NULL,

    CONSTRAINT "Seen_pkey" PRIMARY KEY ("id_beast","id_user")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_id_match_fkey" FOREIGN KEY ("id_match") REFERENCES "Match"("id_match") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Run" ADD CONSTRAINT "Run_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_id_achievments_fkey" FOREIGN KEY ("id_achievments") REFERENCES "Achievements"("id_achievments") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Progress" ADD CONSTRAINT "Progress_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seen" ADD CONSTRAINT "Seen_id_beast_fkey" FOREIGN KEY ("id_beast") REFERENCES "Bestiary"("id_beast") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seen" ADD CONSTRAINT "Seen_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id_user") ON DELETE RESTRICT ON UPDATE CASCADE;
