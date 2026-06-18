"use client";

import { useEffect, useState } from "react";
import type { ExperienceGuideContent } from "@/types/property";
import { ExperienceGuide } from "./ExperienceGuide";
import { Skeleton } from "@/components/atoms/Skeleton";

type Props = {
  propertyCode: string;
};

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-16 w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-20 w-full rounded-xl" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-20 w-full rounded-xl" />
      </div>
    </div>
  );
}

export function ExperienceGuideLoader({ propertyCode }: Props) {
  const [content, setContent] = useState<ExperienceGuideContent | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch(`/api/experiences/${propertyCode}`, { method: "POST" })
      .then((res) => {
        if (!res.ok) throw new Error(`${res.status}`);
        return res.json() as Promise<ExperienceGuideContent>;
      })
      .then(setContent)
      .catch(() => setError(true));
  }, [propertyCode]);

  if (error) {
    return (
      <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Não foi possível carregar as experiências. Tente recarregar a página.
      </p>
    );
  }

  if (!content) return <LoadingSkeleton />;

  return <ExperienceGuide content={content} />;
}
