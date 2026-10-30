import { createApp } from './app';

// Load env config (will exit if invalid)
const { config } = require('./config/env');

const app = createApp();
const PORT = config.PORT ?? 3001;

const server = app.listen(PORT, () => {
  console.log(`🚀 express-app running on port ${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/v1/api/health`);
  console.log(`📦 Items:  http://localhost:${PORT}/v1/api/items`);
  console.log(`🌍 Environment: ${config.NODE_ENV}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully...');
  server.close(() => process.exit(0));
});

export { app };

