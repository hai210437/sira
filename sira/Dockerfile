# ----------- Build Phase -----------
FROM node:20-alpine AS builder
WORKDIR /app

# Nur package-Dateien zuerst kopieren (Caching)
COPY package*.json ./

# Dependencies installieren
RUN npm install

# Restlichen Code kopieren
COPY . .

ARG VITE_MAP_KEY
ENV VITE_MAP_KEY=$VITE_MAP_KEY

# Vite-Build ausführen
RUN npm run build


# ----------- Production Phase -----------
FROM nginx:alpine

# Build-Ergebnis in den Nginx-Ordner kopieren
COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

# Optional: eigenes nginx.conf verwenden (falls du Routing brauchst)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Container läuft auf Port 8080
EXPOSE 80

# Standard-Startbefehl
CMD ["nginx", "-g", "daemon off;"]
