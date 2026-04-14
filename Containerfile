FROM node:25-slim AS base
ARG CI=true
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
RUN pnpm build

FROM base AS runner
COPY ./package.json pnpm-lock.yaml pnpm-workspace.yaml /app/
COPY --from=production-dependencies-env /app/node_modules /app/node_modules/
COPY --from=build-env /app/dist /app/dist/
WORKDIR /app
CMD ["pnpm", "start"]
