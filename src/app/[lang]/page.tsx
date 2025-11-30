import type { Metadata } from "next";
import InteractiveLayout from "@/components/InteractiveLayout";
import PageContent from "@/components/PageContent";
import { type Locale } from "@/i18n/config";

export const metadata: Metadata = {
  alternates: {
    canonical: "https://matiasjrb.com.ar",
  },
};

export default async function Page({
  params,
}: {
  params: Promise<{ lang: Locale }>;
}) {
  const { lang } = await params

  return (
    <InteractiveLayout lang={lang}>
      <PageContent lang={lang} />
    </InteractiveLayout>
  );
}
