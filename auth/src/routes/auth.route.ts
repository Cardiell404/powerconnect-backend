import { JwtMiddleware } from '@powerconnect/shared';
import { Express } from 'express';
import container from '../dependency-injection';
import { AuthLoginController } from '../controllers/auth-login-controller';

export const register = (app: Express): void => {
  const jwt: JwtMiddleware = container.get('Shared.JwtMiddleware');

  const statusGetController = container.get('Apps.controllers.StatusGetController');
  app.get('/api/auth/status', statusGetController.run.bind(statusGetController));

  const authLoginController: AuthLoginController = container.get('Apps.controllers.AuthLoginController');
  app.post('/api/auth/login', AuthLoginController.validator(), authLoginController.run.bind(authLoginController));

  const authSignOutController = container.get('Apps.controllers.AuthSignOutController');
  app.post('/api/auth/signout', AuthLoginController.validator(), authSignOutController.run.bind(authSignOutController));

  const authCurrentUserController = container.get('Apps.controllers.AuthCurrentUserController');
  app.get(
    '/api/auth/currentuser',
    jwt.tokenValidation(),
    authCurrentUserController.run.bind(authCurrentUserController)
  );
};
