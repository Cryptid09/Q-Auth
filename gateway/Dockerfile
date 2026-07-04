# Node.js Gateway Dockerfile
FROM node:22-alpine
WORKDIR /app

# Copy package files first (layer caching)
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy source
COPY src/ src/

EXPOSE 3001

ENV NODE_ENV=production

CMD ["node", "src/index.js"]
