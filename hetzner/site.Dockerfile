FROM node:22.13.1-bookworm-slim AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22.13.1-bookworm-slim AS runtime
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci && npm cache clean --force
ENV NODE_ENV=production
ENV PORT=3211
ENV HOST=0.0.0.0
ENV VINEXT_TRUST_PROXY=1
ENV VINEXT_TRUSTED_HOSTS=granttap.com,www.granttap.com
COPY --from=build /app/dist ./dist
COPY hetzner/site-start.mjs ./hetzner/site-start.mjs
USER node
EXPOSE 3211
CMD ["node", "hetzner/site-start.mjs"]
