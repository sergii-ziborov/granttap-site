FROM node:22.23.3-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build && npm run build:runtime

FROM node:22.23.3-bookworm-slim AS runtime
WORKDIR /app
COPY package.json LICENSE ./
ENV NODE_ENV=production
ENV PORT=3211
ENV HOST=0.0.0.0
ENV VINEXT_TRUST_PROXY=1
ENV VINEXT_TRUSTED_HOSTS=granttap.com,www.granttap.com
COPY --from=build /app/dist/standalone/dist ./dist
COPY --from=build /app/dist/standalone/node_modules ./node_modules
COPY --from=build /app/.runtime/site-start.mjs ./.runtime/site-start.mjs
USER node
EXPOSE 3211
CMD ["node", "/app/.runtime/site-start.mjs"]
