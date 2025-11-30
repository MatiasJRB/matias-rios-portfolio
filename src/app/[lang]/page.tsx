import type { Metadata } from "next";
import InteractiveLayout from "@/components/InteractiveLayout";
import PageContent from "@/components/PageContent";
import { type Locale } from "@/i18n/config";
import { getResume } from "@/data/get-resume";

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
  const { lang } = await params;
  const resume = await getResume(lang);

  return (
    <InteractiveLayout lang={lang}>
      <PageContent lang={lang} resume={resume} />
    </InteractiveLayout>
  );
}
