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
The optional AWS SDK postinstall notice is disabled.
Review any new build-script requests before approving them.

Dependency updates stay within each package's current major version, including
Next.js 15, React 19, Prisma 5, and Tailwind CSS 3. NextAuth remains pinned to
`5.0.0-beta.32`: v5 has no stable release, and moving to stable v4 would require
an authentication migration. React and its types use stable releases.

`react-medium-image-zoom-fixed` still declares React 16–18 peer support; its
latest release is unchanged, so pnpm reports this existing warning with React 19.

Dependencies were checked against npm on September 28, 2026. All 77 direct
dependencies use the newest release in their existing major version (NextAuth
uses the v5 beta channel). The frozen-lockfile install, TypeScript check
(`pnpm exec tsc --noEmit --incremental false`), and production build passed with
Node.js 24.14.0. Standalone `pnpm lint` requires an ESLint configuration, which
this project does not yet have. Database and storage flows were not tested.

Run `pnpm build` to generate Prisma Client and build the application. The app
requires `DATABASE_URL`, `AUTH_SECRET`, `S3_ENDPOINT`, `S3_ACCESS_KEY_ID`,
`S3_SECRET_ACCESS_KEY`, and `S3_BUCKET_NAME` for its database, authentication,
and file-storage features.

For the local SeaweedFS service, set `S3_ENDPOINT=http://localhost:9000` and
`S3_BUCKET_NAME=kotova`. The S3 client uses path-style requests so SeaweedFS
receives object keys under the configured bucket.

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
