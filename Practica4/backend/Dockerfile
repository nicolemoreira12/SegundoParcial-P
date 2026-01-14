# Backend Dockerfile con soporte para webhooks
FROM node:20-alpine

# Instalar dependencias necesarias para SQLite
RUN apk add --no-cache python3 make g++ sqlite

WORKDIR /app

# Crear directorio para la base de datos
RUN mkdir -p /app/data

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3002

CMD ["npm", "run", "start:prod"]
