# ─── 1. Base image ─────────────────────────────────────────────────────────────
FROM node:18

# ─── 2. Set working directory ─────────────────────────────────────────────────
WORKDIR /usr/src/app

# ─── 3. Copy & install server dependencies ────────────────────────────────────
COPY server/package*.json ./server/
RUN cd server && npm install

# ─── 4. Copy full server source (after install) ───────────────────────────────
COPY server/ ./server/

# ─── 5. Copy & install client dependencies (only package.json) ───────────────
COPY client/package*.json ./client/
RUN cd client && npm install --legacy-peer-deps

# ─── 6. Copy full client source (after install) ───────────────────────────────
COPY client/ ./client/

# ─── 7. Debug: list all files inside client/ to confirm everything is there ────
RUN cd client && \
    echo "=== Files in client/ ===" && \
    ls -la && \
    echo "=== Recursive listing of client/ ===" && \
    ls -R .

# ─── 8. Build the React client with legacy OpenSSL provider ────────────────────
RUN cd client && NODE_OPTIONS=--openssl-legacy-provider npm run build

# ─── 9. Copy any remaining root-level files (if needed) ────────────────────────
COPY . .

# ─── 10. Move built client into server/build so Express can serve it ────────────
RUN rm -rf server/build && cp -r client/build server/build

# ─── 11. Final runtime: switch to server folder, expose port, and start app ────
WORKDIR /usr/src/app/server
EXPOSE 5000
CMD ["node", "index.js"]
