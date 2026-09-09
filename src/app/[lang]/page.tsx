import ClientPageWrapper from "@/components/ClientPageWrapper";
import { type Locale } from "@/i18n/config";
import { getResume } from "@/data/get-resume";
import { getDictionary } from "@/i18n/get-dictionary";
import { getNotes } from "@/content/notes";

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
  const showDraftNotes = process.env.NODE_ENV !== "production";
  const showNotes = getNotes({ includeDrafts: showDraftNotes }).length > 0;

  return (
    <ClientPageWrapper
      lang={lang}
      resume={resume}
      dictionary={dictionary}
      showNotes={showNotes}
    />
  );
}
