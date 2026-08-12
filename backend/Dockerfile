FROM node:20-alpine

# 1. Instalar OpenSSL necesario para Prisma en Alpine
RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

COPY . .

# 2. Generar el cliente de Prisma con las librerías del entorno
RUN npx prisma generate

EXPOSE 3001

CMD ["npx", "tsx", "src/server.ts"]