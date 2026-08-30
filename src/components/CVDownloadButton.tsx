"use client";

interface CVDownloadButtonProps {
  lang?: string;
  downloadText?: string;
}

export default function CVDownloadButton({
  lang = "en",
  downloadText = "Download PDF",
}: CVDownloadButtonProps) {
  const handleDownload = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const langUpper = lang.toUpperCase();
    const filename = `[${langUpper}]_Matias_Rios_CV_${month}_${year}.pdf`;

    const originalTitle = document.title;
    document.title = filename.replace(".pdf", "");
    window.print();

    setTimeout(() => {
      document.title = originalTitle;
    }, 1000);
  };

  return (
    <div className="no-print shrink-0 md:fixed md:bottom-8 md:right-8 md:z-[100]">
      <button
        type="button"
        onClick={handleDownload}
        className="control-hover inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-[var(--color-background)] shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-background)] active:translate-y-px md:px-5"
        aria-label={downloadText}
      >
        {downloadText}
      </button>
    </div>
  );
}
