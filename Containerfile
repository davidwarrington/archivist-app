FROM node:25-alpine AS base
ARG CI=true
ARG DATABASE_FILENAME
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm install -g pnpm

FROM base AS development-dependencies-env
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY ./patches /app/patches/
WORKDIR /app
RUN pnpm install --frozen-lockfile

FROM base AS production-dependencies-env
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY ./patches /app/patches/
WORKDIR /app
RUN pnpm install --frozen-lockfile --production

FROM base AS build-env
COPY . /app/
COPY --from=development-dependencies-env /app/node_modules /app/node_modules/
WORKDIR /app
RUN pnpm prisma migrate deploy
RUN pnpm prisma generate
RUN pnpm build

FROM base AS runner
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules/
COPY --from=build-env /app/dist /app/dist/
COPY --from=build-env /app/${DATABASE_FILENAME} /app/${DATABASE_FILENAME}/
WORKDIR /app
CMD ["pnpm", "start"]
