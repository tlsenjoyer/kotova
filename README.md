This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

Use Node.js 20.19 or newer and pnpm 12.7.0 (pinned in `package.json`).
Install dependencies, then run the development server:

```bash
pnpm install --frozen-lockfile
pnpm dev
```

`pnpm-lock.yaml` is the dependency lockfile. Build scripts required by Prisma,
bcrypt, esbuild, sharp, unrs-resolver, and Sass's file watcher are explicitly
approved in `pnpm-workspace.yaml`.
Review any new build-script requests before approving them.

The application uses Next.js 16, React 19, Prisma 5, and Tailwind CSS 3.
NextAuth remains pinned to
`5.0.0-beta.32`: v5 has no stable release, and moving to stable v4 would require
an authentication migration. React and its types use stable releases.

The dependency migration was checked on September 28, 2026 with a lockfile
install, TypeScript check (`pnpm exec tsc --noEmit --incremental false`), lint,
and production build. ESLint reports existing React Hook dependency warnings.
S3 operations passed a local endpoint smoke test; database and live storage
flows require separate integration testing.

Run `pnpm build` to generate Prisma Client and build the application. The app
requires `DATABASE_URL`, `AUTH_SECRET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`,
`S3_SECRET_ACCESS_KEY`, and `S3_BUCKET_NAME` for its database, authentication,
and file-storage features. Set `S3_REGION` to the storage provider's region
(for example, `us-west-002` for Backblaze B2); it defaults to `us-east-1` for
local S3-compatible storage.

For the local SeaweedFS service, set `S3_ENDPOINT=http://localhost:9000` and
`S3_BUCKET_NAME=kotova`. The S3 client uses path-style requests so SeaweedFS
receives object keys under the configured bucket.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Deploy on a VPS with Docker

Use a Linux VPS with Docker Engine, the Docker Compose plugin, a domain pointed at
the server, and an HTTPS reverse proxy such as Caddy or Nginx. The production
Compose file runs the app and PostgreSQL. It binds the app only to
`127.0.0.1:3000`, leaving TLS and public HTTP to the reverse proxy. Configure
the proxy to forward requests and the original host/protocol headers to that
address. If port 3000 is in use, set `APP_PORT` in `.env.production` and use that
port in the proxy too.

For example, after pointing DNS to the VPS, a Caddy site entry can be:

```caddyfile
example.com {
    reverse_proxy 127.0.0.1:3000
}
```

Open ports 80 and 443 to visitors, and keep Postgres and the app port private.

The app also requires a **persistent S3-compatible bucket**. Set `S3_ENDPOINT`
to an HTTPS endpoint reachable by visitors' browsers: downloads use signed URLs
containing that endpoint. Create the bucket and credentials before deployment.
The existing `docker-compose.yml` is for local development and has example
credentials; do not use it for production.

On the VPS, clone this repository and create a private production environment
file. Set a real domain, a strong database password, a fresh auth secret, and S3
credentials. Use the same database password in `POSTGRES_PASSWORD` and
`DATABASE_URL`; URL-encode it in the URL if needed. Keep this file on the VPS,
outside Git, with permissions limited to the deployment user.

```bash
git clone https://github.com/tlsenjoyer/kotova.git
cd kotova
cp .env.production.example .env.production
chmod 600 .env.production
openssl rand -base64 32  # use the output for AUTH_SECRET
# Edit .env.production, then:
bash scripts/deploy.sh
```

The deploy command fast-forwards the checked-out branch, builds a new image,
starts PostgreSQL, applies pending Prisma migrations, and replaces the app
container. A failed build or migration stops before replacing a running app.
The app may be briefly unavailable while its single container is replaced.
Check `docker compose --env-file .env.production -f compose.production.yml ps`
and `docker compose --env-file .env.production -f compose.production.yml logs -f app`
after deployment. `GET /api/health` checks database connectivity.

Recommended release workflow: finish and verify a change locally, commit it,
push it to the branch checked out on the VPS (for example `main`), then SSH into
the VPS and run `bash scripts/deploy.sh`. A Git tag is optional for marking a
release; every pushed commit can be deployed this way. Avoid running the script
from a checkout containing local code changes. For a rollback, restore a known
commit with `git revert`, push it, and redeploy. Check whether any database
migration needs a separate rollback plan. Prisma migrations are not reversed by
reverting a Git commit.

Back up both the PostgreSQL volume and the S3 bucket before the first production
deployment and regularly afterward. Test restoring them. In particular, take a
database backup before deploying a migration that changes or removes data.

Before opening registration to the public, fix credential handling:
`src/lib/credentialsSignUp/createUser.ts` currently stores passwords as plain
text and `src/auth.ts` compares them as plain text. Hash new passwords and plan
an upgrade or reset for existing accounts.
