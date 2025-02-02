# Use node-alpine 18 as the base image
FROM node:20.16-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
#COPY . .

# Expose port 3000
EXPOSE 3000

# Command to run the application
# CMD ["sh"]
# CMD ["npm", "install"]
CMD ["npm", "run", "dev"]
