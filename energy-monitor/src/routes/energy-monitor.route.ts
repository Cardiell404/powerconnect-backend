import { Express } from 'express';
import container from '../dependency-injection';

export const register = (app: Express): void => {
  const authMiddleware = container.get('Shared.JwtMiddleware');

  const statusGetController = container.get('Apps.controllers.StatusGetController');
  app.get('/api/energy-monitor/status', statusGetController.run.bind(statusGetController));

  app.post(
    '/api/energy-monitor/consumption',
    authMiddleware.validateAccessToken(),
    statusGetController.run.bind(statusGetController)
  );

  app.get(
    '/api/energy-monitor/current',
    authMiddleware.validateAccessToken(),
    statusGetController.run.bind(statusGetController)
  );

  app.get(
    '/api/energy-monitor/graph/minute',
    authMiddleware.validateAccessToken(),
    statusGetController.run.bind(statusGetController)
  );

  app.get(
    '/api/energy-monitor/graph/hour',
    authMiddleware.validateAccessToken(),
    statusGetController.run.bind(statusGetController)
  );

  app.get(
    '/api/energy-monitor/graph/day',
    authMiddleware.validateAccessToken(),
    statusGetController.run.bind(statusGetController)
  );

  app.post(
    '/api/energy-monitor/limit',
    authMiddleware.validateAccessToken(),
    statusGetController.run.bind(statusGetController)
  );


  app.get(
    '/api/energy-monitor/limit',
    authMiddleware.validateAccessToken(),
    statusGetController.run.bind(statusGetController)
  );

  app.get(
    '/api/energy-monitor/history',
    authMiddleware.validateAccessToken(),
    statusGetController.run.bind(statusGetController)
  );
};
