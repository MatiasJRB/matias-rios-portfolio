import type { Metadata } from "next";
import InteractiveLayout from "@/components/InteractiveLayout";
import PageContent from "@/components/PageContent";
import { type Locale } from "@/i18n/config";
import { getResume } from "@/data/get-resume";
import { getDictionary } from "@/i18n/get-dictionary";

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
  const [resume, dictionary] = await Promise.all([
    getResume(lang),
    getDictionary(lang),
  ]);

  return (
    <InteractiveLayout
      lang={lang}
      dictionary={dictionary}
      profiles={resume.basics.profiles}
    >
      <PageContent lang={lang} resume={resume} dictionary={dictionary} />
    </InteractiveLayout>
  );
}
