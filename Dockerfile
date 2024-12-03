# Use the Node.js image
FROM node:16

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package files to install dependencies
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of your application files
COPY . .

# Expose the port your app runs on (default for Node.js is often 3000)
EXPOSE 3000

# Command to run your app
CMD ["node", "app.js"]

