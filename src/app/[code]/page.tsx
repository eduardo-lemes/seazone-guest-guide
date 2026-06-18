import { notFound } from "next/navigation";
import { getProperty } from "@/lib/db/queries/properties";
import { GuideLayout } from "@/components/templates/GuideLayout";
import { PropertyHeader } from "@/components/organisms/PropertyHeader";
import { AccessInfo } from "@/components/organisms/AccessInfo";
import { StayRules } from "@/components/organisms/StayRules";
import { ContactSection } from "@/components/organisms/ContactSection";
import { ExperienceGuideLoader } from "@/components/organisms/ExperienceGuideLoader";

type Props = { params: Promise<{ code: string }> };

export default async function GuidePage({ params }: Props) {
  const { code } = await params;
  const property = await getProperty(code.toUpperCase());

  if (!property) notFound();

  return (
    <GuideLayout
      header={<PropertyHeader property={property} />}
      accessInfo={<AccessInfo operational={property.operational} />}
      stayRules={<StayRules rules={property.rules} />}
      contact={<ContactSection property={property} />}
      experienceGuide={<ExperienceGuideLoader propertyCode={property.code} />}
    />
  );
}
