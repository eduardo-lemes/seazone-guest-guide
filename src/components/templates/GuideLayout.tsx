import { TopNav } from "@/components/organisms/TopNav";
import { PropertyHeader } from "@/components/organisms/PropertyHeader";
import { TabbedContent } from "@/components/organisms/TabbedContent";
import { ChatSidebar } from "@/components/organisms/ChatSidebar";
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
      <main className="mx-auto max-w-5xl px-4 pb-20 pt-6">
        <PropertyHeader property={property} />

        <div className="mt-6 flex items-start gap-6">
          <div className="min-w-0 flex-1">
            <TabbedContent
              property={property}
              accessInfo={accessInfo}
              stayRules={stayRules}
              contact={contact}
              amenities={amenities}
              experienceGuide={experienceGuide}
            />
          </div>

          <div className="hidden w-[300px] shrink-0 xl:block">
            <ChatSidebar propertyCode={property.code} />
          </div>
        </div>
      </main>

      <div className="xl:hidden">
        <ChatPanel propertyCode={property.code} />
      </div>
    </>
  );
}
