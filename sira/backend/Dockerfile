FROM node:20-alpine

WORKDIR /app

COPY package*.json ./


RUN npm install

COPY . .

ENV PORT=67

EXPOSE 67

CMD ["node", "index.js"]