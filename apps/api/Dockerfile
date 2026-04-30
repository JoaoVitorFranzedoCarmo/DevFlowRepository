FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma client
RUN npx prisma generate

# Copy source code
COPY . .

# Build TypeScript
# Limit Node.js heap to 256MB to prevent excessive memory use inside container
ENV NODE_OPTIONS="--max-old-space-size=256"
RUN npm run build

# Copy entrypoint
COPY entrypoint.sh ./entrypoint.sh
RUN chmod +x entrypoint.sh

# Expose port
EXPOSE 3001

ENTRYPOINT ["./entrypoint.sh"]
