FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./
COPY public ./public
USER node
ENV PORT=3210 HOST=0.0.0.0
EXPOSE 3210
CMD ["node", "server.mjs"]
