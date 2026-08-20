# Práctica de Maestría - Flujo DevOps y Automatización

Este repositorio contiene la implementación de una aplicación multicapa con **Backend (Node.js / Express)**, **Frontend (React / Vite)** y **Base de Datos Relacional**, orquestados mediante **Docker Compose** e integrados con **GitHub Actions (CI)**.

## 🚀 Arquitectura del Proyecto
- **Backend:** Node.js / TypeScript con Prisma ORM
- **Frontend:** React / Vite
- **Base de Datos:** PostgreSQL / MariaDB accesible mediante DBeaver
- **Contenedores:** Docker & Docker Compose
- **CI/CD:** GitHub Actions

## 🛠️ Ejecución con Docker

Para levantar los servicios de la aplicación y la base de datos localmente:

```bash
docker-compose up -d --build
semana 3