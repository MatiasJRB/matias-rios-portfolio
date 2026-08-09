# Security policy

## Reporting a vulnerability

Please do not open a public issue for a suspected vulnerability. Use GitHub's
private vulnerability reporting for this repository, or contact Matias through
the email address published at [matiasjriosb.com.ar](https://matiasjriosb.com.ar).

Include reproduction steps, the affected route or component, and the impact.
You should receive an acknowledgement within seven days.

## Secrets and user data

- Credentials belong in local or deployment environment variables only.
- The recruiter assistant sends messages and extracted attachment text to
  Google Gemini; the application does not intentionally persist them.
- Do not use real personal or confidential documents in test fixtures.
