interface CVDownloadButtonProps {
  lang?: string;
  downloadText?: string;
}

export default function CVDownloadButton({
  lang = "en",
  downloadText = "Download PDF",
}: CVDownloadButtonProps) {
  const normalizedLang = lang === "es" ? "es" : "en";
  const filename = `Matias_Rios_CV_${normalizedLang.toUpperCase()}.pdf`;

  return (
    <div className="no-print shrink-0 md:fixed md:bottom-8 md:right-8 md:z-[100]">
      <a
        href={`/cv/matias-rios-${normalizedLang}.pdf`}
        download={filename}
        className="control-hover inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-background)] shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] active:translate-y-px md:px-5"
        aria-label={downloadText}
      >
        {downloadText}
      </a>
    </div>
  );
}
