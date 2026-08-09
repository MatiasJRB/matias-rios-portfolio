# Matias Rios — portfolio

[![CI](https://github.com/MatiasJRB/matias-rios-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/MatiasJRB/matias-rios-portfolio/actions/workflows/ci.yml)

Source code for [matiasjriosb.com.ar](https://matiasjriosb.com.ar), my bilingual portfolio and resume. It presents the same professional narrative as my GitHub profile: product-minded software engineering, 8+ years shipping production systems, and selected independent work.

## What is included

- Spanish and English portfolio and printable CV routes
- Structured resume content under `src/data/resume`
- Project history, skills, accessibility and SEO metadata
- `llms.txt` and `llms-full.txt` machine-readable profile routes
- Recruiter assistant powered by Google Gemini, with PDF, DOCX, Markdown and text context extraction
- Optional distributed rate limiting through Upstash Redis

## Stack

- Next.js 16, React 19 and TypeScript
- Tailwind CSS 4 and Framer Motion
- Vercel for deployment
- Google Gemini for the optional recruiter assistant

## Run locally

Requirements: Node.js 20.9+ and npm.

```bash
cp .env.example .env.local
npm ci
npm run dev
```

Open [http://localhost:3000/es](http://localhost:3000/es) or [http://localhost:3000/en](http://localhost:3000/en). The portfolio works without AI credentials; only the recruiter assistant needs `GEMINI_API_KEY`.

## Environment variables

| Variable | Required | Purpose |
| --- | --- | --- |
| `GEMINI_API_KEY` | For AI chat | Server-only Gemini credential |
| `GEMINI_MODEL` | No | Gemini model override |
| `UPSTASH_REDIS_REST_URL` | Recommended in production | Shared serverless rate limiting |
| `UPSTASH_REDIS_REST_TOKEN` | Recommended in production | Shared serverless rate limiting |
| `ANALYZE` | No | Enables bundle analysis when supported |

Never prefix private credentials with `NEXT_PUBLIC_` or commit a real `.env` file.

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

The same checks run in GitHub Actions.

## AI data handling

Messages and extracted text from files attached to the recruiter assistant are sent to Google Gemini to generate a response. This application does not intentionally persist those conversations. File size, type and extracted-text limits are enforced by the server routes.

## Contributing and security

Small fixes are welcome; read [CONTRIBUTING.md](CONTRIBUTING.md). Please report vulnerabilities privately as described in [SECURITY.md](SECURITY.md).

## License

The application source code is available under the MIT License. Personal content, resume data, photographs, branding and portfolio assets are excluded; see [LICENSE](LICENSE).
