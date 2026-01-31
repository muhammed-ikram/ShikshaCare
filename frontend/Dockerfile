FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Build for production
RUN npm run build

# Expose port (Preview or Serve)
EXPOSE 4173

# Using vite preview for simplicity in this demo, usually Nginx is better
CMD ["npm", "run", "preview", "--", "--host"]
