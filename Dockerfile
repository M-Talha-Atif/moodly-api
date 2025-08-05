# Base image
FROM node:20-alpine

# Set working directory
WORKDIR /usr/src/app

# Install dependencies first (better caching)
COPY package*.json ./
RUN npm install -g @nestjs/cli && npm install

# Copy source code
COPY . .

# Expose NestJS port
EXPOSE 3000

# Start in development mode (hot reload)
CMD ["sh", "-c", "npm run migration:run && npm run start:dev"]
