import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import router from './routes';
import { errorHandler } from './shared/middleware/errorHandler';
import { notFound } from './shared/middleware/notFound';

export function createApp() {
  const app = express();

  // Security & logging middleware
  app.use(helmet());
  app.use(cors());
  app.use(morgan('combined'));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Routes
  app.use('/', router);

  // 404 & error handlers (must come last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
