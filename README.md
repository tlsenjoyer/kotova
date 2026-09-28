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
Compose file runs the app, PostgreSQL, and SeaweedFS S3 storage. It binds the
app to `127.0.0.1:3000` and SeaweedFS to `127.0.0.1:9000`, leaving TLS and
public HTTP to the reverse proxy. If either port is in use, adjust the Compose
port mapping and the corresponding proxy upstream.

Point both the app domain and a dedicated S3 subdomain at the VPS. For example,
a host-installed Caddy can use:

```caddyfile
example.com {
    reverse_proxy 127.0.0.1:3000
}

s3.example.com {
    reverse_proxy 127.0.0.1:9000
}
```

Open ports 80 and 443 to visitors. Keep PostgreSQL, the app port, and the
SeaweedFS port private. Set `APP_URL` and `AUTH_URL` to `https://example.com`
and `S3_ENDPOINT` to `https://s3.example.com` in `.env.production`.

The deployment starts SeaweedFS with a persistent Docker volume and creates
the bucket named by `S3_BUCKET_NAME`. Set strong `S3_ACCESS_KEY_ID` and
`S3_SECRET_ACCESS_KEY` values. `S3_ENDPOINT` must use the public HTTPS name:
downloads use signed URLs containing that endpoint. The app container must also
be able to resolve and reach that name through Caddy for uploads.
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
starts PostgreSQL and SeaweedFS, applies pending Prisma migrations, and
replaces the app container. A failed build or migration stops before replacing
a running app.
The app may be briefly unavailable while its single container is replaced.
Check `docker compose --env-file .env.production -f compose.production.yml ps`
and `docker compose --env-file .env.production -f compose.production.yml logs -f app seaweedfs`
after deployment. `GET /api/health` checks database connectivity, but does not
check S3. Test an actual file upload and signed download after deploying.

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
Both volumes live on one VPS, so a server or disk failure can take out the app,
database, and files together. Keep backups off the VPS and monitor free disk space.

Before opening registration to the public, fix credential handling:
`src/lib/credentialsSignUp/createUser.ts` currently stores passwords as plain
text and `src/auth.ts` compares them as plain text. Hash new passwords and plan
an upgrade or reset for existing accounts.
