# ─── 1. Use Node 18 as base ────────────────────────────────────────────────────
FROM node:18

# ─── 2. Set working directory ─────────────────────────────────────────────────
WORKDIR /usr/src/app

# ─── 3. Copy & install server dependencies ────────────────────────────────────
COPY server/package*.json ./server/
RUN cd server && npm install

# ─── 4. Copy & install client dependencies ────────────────────────────────────
COPY client/package*.json ./client/
RUN cd client && npm install

# ─── 5. Build the React client with legacy OpenSSL provider flag ─────────────
# This avoids the “ERR_OSSL_EVP_UNSUPPORTED” error on Node 18+
RUN cd client && NODE_OPTIONS=--openssl-legacy-provider npm run build

# ─── 6. Copy the rest of the project (source files) ───────────────────────────
COPY . .

# ─── 7. Move the built client into server’s “build” folder ─────────────────────
RUN cp -r client/build server/build

# ─── 8. Switch to the server folder, expose port and start the app ────────────
WORKDIR /usr/src/app/server
EXPOSE 5000
CMD ["node", "index.js"]
