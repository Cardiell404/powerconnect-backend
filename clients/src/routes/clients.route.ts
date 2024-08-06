import { Express } from 'express';
import container from '../dependency-injection';

export const register = (app: Express): void => {
  const statusGetController = container.get('Apps.controllers.StatusGetController');

  app.get('/api/clients/status', statusGetController.run.bind(statusGetController));
};
