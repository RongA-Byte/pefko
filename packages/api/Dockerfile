FROM node:20-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

FROM base AS build
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo build --filter=@arca/api...

FROM base AS runtime
WORKDIR /app
COPY --from=build /app/packages/api/dist ./dist
COPY --from=build /app/packages/api/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/packages/db/dist ./node_modules/@arca/db/dist
COPY --from=build /app/packages/shared/dist ./node_modules/@arca/shared/dist

ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/index.js"]
