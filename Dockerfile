# ─── 1. Base image ─────────────────────────────────────────────────────────────
FROM node:18

# ─── 2. Set working directory ─────────────────────────────────────────────────
WORKDIR /usr/src/app

# ─── 3. Copy & install server dependencies ────────────────────────────────────
COPY server/package*.json ./server/
RUN cd server && npm install

# ─── 4. Copy & install client dependencies (with legacy peer-deps) ─────────────
COPY client/package*.json ./client/
RUN cd client && npm install --legacy-peer-deps

# ─── 5. Build the React client with legacy OpenSSL provider ────────────────────
RUN cd client && NODE_OPTIONS=--openssl-legacy-provider npm run build

# ─── 6. Copy the rest of the project (all source files) ────────────────────────
COPY . .

# ─── 7. Move built client into server/build so Express can serve it ────────────
RUN rm -rf server/build && cp -r client/build server/build

# ─── 8. Switch to server folder, expose port, and start the app ───────────────
WORKDIR /usr/src/app/server
EXPOSE 5000
CMD ["node", "index.js"]
