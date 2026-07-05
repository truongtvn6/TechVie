# =============================================
# Stage 1: Install dependencies
# =============================================
FROM node:20-alpine AS deps

WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install only production dependencies
RUN npm ci --only=production

# =============================================
# Stage 2: Production image
# =============================================
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 techvie

# Copy production node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy application source (excluding what's in .dockerignore)
COPY . .

# Set ownership to non-root user
RUN chown -R techvie:nodejs /app

USER techvie

# Expose backend port
EXPOSE 5000

# Health check to verify the app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:5000/ || exit 1

# Start the server
CMD ["node", "server.js"]
