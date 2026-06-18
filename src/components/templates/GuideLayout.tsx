import { TopNav } from "@/components/organisms/TopNav";
import { PropertyHeader } from "@/components/organisms/PropertyHeader";
import { TabbedContent } from "@/components/organisms/TabbedContent";
import { ChatPanel } from "@/components/organisms/ChatPanel";
import type { Property } from "@/types/property";

type GuideLayoutProps = {
  property: Property;
  accessInfo: React.ReactNode;
  stayRules: React.ReactNode;
  contact: React.ReactNode;
  amenities: React.ReactNode;
  experienceGuide: React.ReactNode;
};

export function GuideLayout({
  property,
  accessInfo,
  stayRules,
  contact,
  amenities,
  experienceGuide,
}: GuideLayoutProps) {
  return (
    <>
      <TopNav />
      <main className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <PropertyHeader property={property} />
        <div className="mt-8">
          <TabbedContent
            property={property}
            accessInfo={accessInfo}
            stayRules={stayRules}
            contact={contact}
            amenities={amenities}
            experienceGuide={experienceGuide}
          />
        </div>
      </main>
      <ChatPanel propertyCode={property.code} />
    </>
  );
}
