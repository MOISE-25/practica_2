# Etapa 1: Compilación de la app con Node.js
FROM node:20-alpine AS builder

WORKDIR /app

# Copiar paquetes e instalar dependencias
COPY package*.json ./
RUN npm ci

# Copiar código fuente y compilar (genera la carpeta dist/)
COPY . .
RUN npm run build

# Etapa 2: Servidor web ultra ligero con Nginx
FROM nginx:alpine

# Copiar los archivos estáticos generados por Vite hacia Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada con proxy hacia el backend
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer el puerto estándar de Nginx
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]