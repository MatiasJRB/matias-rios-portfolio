"use client";
import { usePathname } from "next/navigation";
import SmoothScroll from "@/components/SmoothScroll";

export default function ClientEffects() {
  const pathname = usePathname();
  // Disable effects on CV page to prevent print layout issues (especially from Lenis/SmoothScroll)
  const isCVPage = pathname?.includes("/cv");

  if (isCVPage) return null;

  return (
    <SmoothScroll />
  );
}
