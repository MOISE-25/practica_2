# Etapa 1: Compilación de la app con Node.js
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Etapa 2: Servidor web ultra ligero con Nginx
FROM nginx:alpine

# Copiar los archivos estáticos generados por Vites
COPY --from=builder /app/dist /usr/share/nginx/html

# Eliminar archivo de configuración por defecto de Nginx
RUN rm -f /etc/nginx/conf.d/default.conf

# Copiar tu configuración personalizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]