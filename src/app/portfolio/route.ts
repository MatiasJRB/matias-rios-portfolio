const title = "Matias Rios | Product & Platform Engineering";
const description =
  "Selected work in product engineering, architecture, and technical leadership. Available in Spanish and English.";

export function GET() {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,follow" />
    <title>${title}</title>
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="https://www.matiasjrb.com.ar/portfolio" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
  </head>
  <body>
    <main>
      <p>Opening the portfolio in your language…</p>
      <p>
        <a href="/en">Continue in English</a> ·
        <a href="/es">Continuar en español</a>
      </p>
    </main>
    <script>
      (() => {
        const cookieLocale = document.cookie
          .split("; ")
          .find((entry) => entry.startsWith("NEXT_LOCALE="))
          ?.split("=")[1];
        const locale =
          cookieLocale === "en" || cookieLocale === "es"
            ? cookieLocale
            : navigator.language.toLowerCase().startsWith("en")
              ? "en"
              : "es";
        window.location.replace("/" + locale);
      })();
    </script>
  </body>
</html>`;

  return new Response(html, {
    headers: {
      "Cache-Control": "public, max-age=3600",
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
