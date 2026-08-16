import Fastify from 'fastify';
import cors from '@fastify/cors';
import { userRoutes } from './routes/userRoutes';

// 1. Exportar la constante app para que el test pueda importarla
export const app = Fastify({
  logger: process.env.NODE_ENV !== 'test', // Desactiva logs molestos durante los tests
});

// Registrar CORS
app.register(cors, {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

// Endpoint de prueba /health
app.get('/health', async () => {
  return {
    status: 'ok',
    message: "Servidor backend Fastify activo",
    version: process.env.APP_VERSION ?? 'v1',
    service: 'backend',
    timestamp: new Date()
  };
});

// Registrar Rutas
app.register(userRoutes);

const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3001;

const start = async () => {
  try {
    await app.listen({ port, host: '0.0.0.0' });
    console.log(`🚀 Servidor backend escuchando en http://localhost:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

// 2. Solo iniciar el servidor en puerto si NO se está ejecutando desde Jest/Tests
if (process.env.NODE_ENV !== 'test') {
  start();
}