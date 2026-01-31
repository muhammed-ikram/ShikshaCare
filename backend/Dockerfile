FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "start"]
