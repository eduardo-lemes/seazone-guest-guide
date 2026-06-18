-- CreateTable
CREATE TABLE "PropertyInsight" (
    "propertyCode" TEXT NOT NULL,
    "seasonalTip" TEXT NOT NULL,
    "lockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PropertyInsight_pkey" PRIMARY KEY ("propertyCode")
);

-- AddForeignKey
ALTER TABLE "PropertyInsight" ADD CONSTRAINT "PropertyInsight_propertyCode_fkey" FOREIGN KEY ("propertyCode") REFERENCES "Property"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
