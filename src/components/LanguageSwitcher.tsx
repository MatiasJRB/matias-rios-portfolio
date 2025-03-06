"use client"; // Asegurar que se ejecuta en el cliente

import { useRouter, usePathname } from "next/navigation";
import { useTransition } from "react";
import { routing } from "@/i18n/routing";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();

  const currentLocale = pathname.split("/")[1] as "en" | "es";
  const [isPending, startTransition] = useTransition();

  const changeLanguage = (locale: string) => {
    if (locale === currentLocale) return; // Evitar cambios innecesarios

    const newPath = `/${locale}${pathname.substring(currentLocale.length + 1)}`;

    // Usamos startTransition para que Next.js maneje el cambio sin recargar
    startTransition(() => {
      router.replace(newPath);
    });
  };

  // ordernar routing.locales de manera que "es" sea el primero
  const locales = [...routing.locales].sort((a) => (a === "es" ? -1 : 1));

  // Calcular la posición del slider basado en el idioma actual
  const sliderPosition = locales.indexOf(currentLocale) / locales.length;

  return (
    <div
      className="relative flex items-center
      p-1 border border-accent/15
          rounded-lg
    "
    >
      {/* Slider animado */}
      <div
        className={`
          absolute  shadow-md
          transition-all
          duration-300 ease-in-out
          h-8 w-1/2 transform ${isPending ? "opacity-50" : ""}
        `}
        style={{
          width: `${100 / routing.locales.length}%`,
          transform: `translateX(${sliderPosition * 100}%)`,
        }}
      />
      {/* Botones de idioma */}
      {routing.locales.map((locale) => (
        <button
          key={locale}
          onClick={() => changeLanguage(locale)}
          className={`
            relative z-10 flex-1 px-2 py-2 text-sm 
            rounded-lg transition-colors duration-300 ease-in-out
            ${
              locale === currentLocale
                ? "bg-accent/15 text-opacity-90 "
                : "text-gray-400 hover:text-gray-200 hover:scale-105"
            }
            ${isPending ? "cursor-not-allowed" : ""}
          `}
          disabled={isPending} // Evita múltiples clics mientras cambia
        >
          {locale.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
