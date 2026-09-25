# aevra prelaunch

A complete Next.js / React / TypeScript site in the selected Midnight Science design: deep navy, refined serif typography, original generated product and coastal photography, responsive layouts, accessible email forms, SQLite persistence, duplicate protection, rate limiting, and token-based deletion. Image prompts and asset paths are documented in `design/midnight-images.md`.

## Run

Requires Node.js 24 and npm.

```sh
npm ci
npm run dev
```

Open http://localhost:3000. Signups are saved to `data/aevra.sqlite`, not browser storage. No third-party API key is required. This project captures the waitlist; it does not send emails or claim to send a confirmation email.

## Production

Set `SITE_URL` to the public HTTPS origin (no trailing slash), `DATABASE_PATH` to a writable persistent disk path, and `TRUST_PROXY=true` only behind a trusted proxy that replaces `X-Forwarded-For`. Default local rate limiting shares a bucket across requests. Use one Node instance with persistent storage; ephemeral/serverless hosting without a persistent volume is unsuitable for this SQLite implementation.

```sh
npm run build
npm start
```

Or deploy the Dockerfile to a container host:

```sh
docker build -t aevra .
docker run -d -p 3000:3000 -v aevra-data:/app/data -e SITE_URL=https://your-domain.com aevra
```

Terminate HTTPS at your hosting proxy. Back up the SQLite database using SQLite's backup command (or stop the service before copying the database and WAL). Restrict disk access to the service account. The Docker image runs as a non-root user. Set environment variables in the host dashboard; never commit secrets.

## Data and sending

The `subscribers` table stores email, consent version, creation timestamp, and a private removal token. The initial successful signup displays a personal removal link; duplicate submissions never reveal that token. To send an announcement, use your authenticated email service and include `${SITE_URL}/unsubscribe?token=${token}` in every message. The site does not include an unauthenticated subscriber-export endpoint. Access records through authorized SQLite tooling on the server. No fictitious reviews, health outcomes, or certification claims are presented.

Brand name, packaging art, and copy were created for this project because source brand details were not supplied. The product is explicitly described as in development. Before launching a real supplement, replace the brand direction with approved business details, finalize the formula and packaging, and adapt the privacy notice to your actual operator and providers. Google Fonts is the only external visual dependency; system fonts provide a fallback.

## Verification

With the app running:

```sh
npm test
```

Tests cover invalid email, consent, origin rejection, persistence through duplicate detection, private token handling, deletion/rejoining, and public routes. Use a disposable database for repeated test runs; rate limiting is intentionally active. Test subscribers remove themselves. `npm run build` also checks TypeScript.
