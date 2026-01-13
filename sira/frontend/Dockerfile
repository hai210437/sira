# ----------- Build Phase (Vite / Static Website) -----------
FROM node:20-alpine AS builder

WORKDIR /app

# Package-Dateien zuerst kopieren (besseres Caching)
COPY package*.json ./
RUN npm install

# Restlichen Code kopieren
COPY . .

# Optional: Environment Variables (z. B. API Keys, Maps)
ARG VITE_MAP_KEY
ENV VITE_MAP_KEY=$VITE_MAP_KEY

# Produktions-Build ausführen
RUN npm run build


# ----------- Production Phase (NGINX) -----------
FROM nginx:alpine

# Standard-NGINX-Verzeichnis leeren
RUN rm -rf /usr/share/nginx/html/*

# Wenn dein Build in /dist/public liegt:
COPY --from=builder /app/dist /usr/share/nginx/html
# Wenn dein Build direkt in /dist landet, nimm stattdessen:
# COPY --from=builder /app/dist /usr/share/nginx/html

# Optional: eigene nginx.conf für sauberes Routing (SPA-Support)
#COPY nginx.conf /etc/nginx/conf.d/default.conf

# Port 80 (für NPM Reverse Proxy)
EXPOSE 80

# Standard-NGINX-Startbefehl
CMD ["nginx", "-g", "daemon off;"]