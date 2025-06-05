# Base image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Copy server package.json and install server deps
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy client package.json and install client deps
COPY client/package*.json ./client/
RUN cd client && NODE_OPTIONS=--openssl-legacy-provider npm run build



# Copy full project
COPY . .

# Build client (React)
RUN cd client && npm run build

# Replace client/src with built static files for production (optional)
# Or serve with Express using static middleware
RUN cp -r client/build server/build

# Set workdir to server for starting the app
WORKDIR /usr/src/app/server

# Expose server port
EXPOSE 5000

# Start server using Node (not nodemon in prod)
CMD ["node", "index.js"]
