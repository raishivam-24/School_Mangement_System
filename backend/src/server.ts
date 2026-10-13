/**
 * @file server.ts
 * @description Application Server Entry Point with database connection check and graceful shutdown handling.
 */

import http from 'http';
import { createApp } from './app.js';
import { env } from './config/env.js';
import { prisma } from './db/prisma.js';
import { initSocketServer } from './socket/socket.server.js';

const startServer = async () => {
  try {
    // 1. Verify Database connectivity
    console.log('🔄 Connecting to PostgreSQL database...');
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected successfully.');

    // 2. Initialize Express application & HTTP Server
    const app = createApp();
    const server = http.createServer(app);

    // 3. Attach Socket.io Engine
    initSocketServer(server);

    // 4. Start listening
    server.listen(env.PORT, () => {
      console.log(`\n🚀 =================================================`);
      console.log(`🏫 School Management SaaS Backend is RUNNING!`);
      console.log(`🌐 Server Port: ${env.PORT}`);
      console.log(`🔗 API Base: http://localhost:${env.PORT}${env.API_PREFIX}`);
      console.log(`💚 Health:   http://localhost:${env.PORT}/health`);
      console.log(`⚙️  Mode:     ${env.NODE_ENV}`);
      console.log(`💬 WebSockets: Socket.io Real-Time Messaging Active`);
      console.log(`🚀 =================================================\n`);
    });

    // 5. Graceful Shutdown on termination signals
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        console.log('🔌 HTTP server closed.');
        await prisma.$disconnect();
        console.log('📦 Database connections closed.');
        process.exit(0);
      });

      // Force exit after 10s timeout
      setTimeout(() => {
        console.error('⚠️ Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
