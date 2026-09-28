FROM node:24-bookworm-slim AS build

WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/* \
  && npm install -g pnpm@12.7.0

COPY package.json pnpm-lock.yml pnpm-workspace.yml ./
RUN pnpm install --frozen-lockfile

COPY . .

# Build-time placeholders are never production credentials. Next.js evaluates
# some server modules during its build, so their required variables must exist.
ARG APP_URL=http://localhost:3000
ENV APP_URL=${APP_URL} \
  DATABASE_URL=postgresql://build:build@localhost:5432/build \
  AUTH_SECRET=build-only-placeholder \
  S3_ENDPOINT=https://example.invalid \
  S3_ACCESS_KEY_ID=build-only-placeholder \
  S3_SECRET_ACCESS_KEY=build-only-placeholder \
  S3_BUCKET_NAME=build-only-placeholder
RUN pnpm build

FROM node:24-bookworm-slim AS runtime

WORKDIR /app
ENV NODE_ENV=production PORT=3000 HOSTNAME=0.0.0.0
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*
COPY --from=build --chown=node:node /app /app
USER node
EXPOSE 3000
CMD ["node_modules/.bin/next", "start", "-H", "0.0.0.0"]
