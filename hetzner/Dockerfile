FROM node:22-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force
COPY hetzner/server.mjs ./hetzner/server.mjs
COPY hetzner/client-access.mjs ./hetzner/client-access.mjs
COPY hetzner/hostwatch-client.mjs ./hetzner/hostwatch-client.mjs
COPY hetzner/connect ./hetzner/connect
COPY hetzner/billing.ts ./hetzner/billing.ts
COPY hetzner/public ./hetzner/public
COPY worker/account ./worker/account
COPY app/ProductOffer/index.ts ./app/ProductOffer/index.ts
COPY migrations ./migrations
RUN mkdir /data && chown node:node /data
USER node
ENV PORT=3210 HOST=0.0.0.0 GRANTTAP_ACCOUNT_DB=/data/accounts.sqlite
EXPOSE 3210
CMD ["node", "--import", "tsx", "hetzner/server.mjs"]
