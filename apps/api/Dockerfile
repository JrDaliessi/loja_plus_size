# syntax=docker/dockerfile:1.7

FROM node:24.21.0-bookworm-slim AS toolchain

ENV PNPM_HOME=/pnpm
ENV PATH=$PNPM_HOME:$PATH

RUN corepack enable \
  && corepack prepare pnpm@11.19.0 --activate

WORKDIR /workspace

FROM toolchain AS build

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
COPY tsconfig.base.json turbo.json ./
COPY apps/api/package.json apps/api/package.json

RUN pnpm install --frozen-lockfile --filter @plus-store/api...

COPY apps/api apps/api

RUN pnpm --filter @plus-store/api run build \
  && pnpm --filter @plus-store/api --prod deploy --legacy /runtime

FROM node:24.21.0-bookworm-slim AS runtime

ENV NODE_ENV=production
ENV PORT=3001

WORKDIR /app

RUN groupadd --system --gid 10001 plusstore \
  && useradd --system --uid 10001 --gid plusstore plusstore

COPY --from=build --chown=10001:10001 /runtime/ ./

USER plusstore

EXPOSE 3001

CMD ["node", "dist/main.js"]
