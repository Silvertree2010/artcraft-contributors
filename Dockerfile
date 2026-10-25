FROM node:22-alpine
WORKDIR /app
COPY server.mjs ./
COPY web ./web
ENV DATA=/data WEB=/app/web PORT=8080 BASE_URL=https://artcraft.apollonet.dev
USER node
EXPOSE 8080
CMD ["node", "server.mjs"]
