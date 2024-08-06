import { Express } from 'express';
import container from '../dependency-injection';

export const register = (app: Express): void => {
  const statusGetController = container.get('Apps.controllers.StatusGetController');

  app.get('/api/users/status', statusGetController.run.bind(statusGetController));
};
