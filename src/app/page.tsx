import type { Metadata } from "next";
import InteractiveLayout from "@/components/InteractiveLayout";
import PageContent from "@/components/PageContent";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://matiasjrb.com.ar",
  },
};

export default function Page() {
  return (
    <InteractiveLayout>
      <PageContent />
    </InteractiveLayout>
  );
}

