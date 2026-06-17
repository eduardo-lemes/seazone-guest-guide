-- CreateTable
CREATE TABLE "Property" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "propertyType" TEXT NOT NULL,
    "bedroomQuantity" INTEGER NOT NULL,
    "bathroomQuantity" INTEGER NOT NULL,
    "guestCapacity" INTEGER NOT NULL,
    "address" JSONB NOT NULL,
    "operational" JSONB NOT NULL,
    "rules" JSONB NOT NULL,
    "amenities" JSONB NOT NULL,
    "images" TEXT[],
    "hostName" TEXT NOT NULL,
    "hostPhone" TEXT NOT NULL,

    CONSTRAINT "Property_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "ExperienceGuide" (
    "id" TEXT NOT NULL,
    "propertyCode" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ExperienceGuide_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExperienceGuide_propertyCode_key" ON "ExperienceGuide"("propertyCode");

-- AddForeignKey
ALTER TABLE "ExperienceGuide" ADD CONSTRAINT "ExperienceGuide_propertyCode_fkey" FOREIGN KEY ("propertyCode") REFERENCES "Property"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
