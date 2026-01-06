FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files (if we add dependencies later)
COPY package*.json ./

# Copy application files
COPY index.html styles.css script.js server.js ./

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "server.js"]

