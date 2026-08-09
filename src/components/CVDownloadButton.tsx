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
    console.log("Download button clicked!");

    // Generate filename with language and date
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();
    const langUpper = lang.toUpperCase();
    const filename = `[${langUpper}]_Matias_Rios_CV_${month}_${year}.pdf`;

    console.log("Generated filename:", filename);

    // Set document title for PDF export
    const originalTitle = document.title;
    document.title = filename.replace(".pdf", "");

    console.log("About to call window.print()...");

    try {
      // Trigger print dialog which can save as PDF
      window.print();
      console.log("window.print() called successfully");
    } catch (error) {
      console.error("Error calling window.print():", error);
    }

    // Restore original title
    setTimeout(() => {
      document.title = originalTitle;
      console.log("Title restored");
    }, 1000);
  };

  return (
    <div className="no-print fixed bottom-4 right-4 md:bottom-8 md:right-8 z-[100]">
      <button
        onClick={handleDownload}
        className="control-hover flex cursor-pointer items-center gap-2 rounded-full bg-[var(--color-primary)] px-4 py-2 font-semibold text-[var(--color-background)] shadow-lg hover:bg-[var(--color-primary-hover)] md:rounded-lg md:px-6 md:py-3"
        aria-label="Download PDF"
      >
        {/* Icon only on mobile, text + icon on desktop */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        <span className="hidden md:inline">{downloadText}</span>
      </button>
    </div>
  );
}
