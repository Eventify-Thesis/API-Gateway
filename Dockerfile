# Use Node.js image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app (if using TypeScript)
RUN npm run build

# Expose port (adjust if needed)
EXPOSE 3000

# Start the app
CMD ["npm", "run", "start:prod"]