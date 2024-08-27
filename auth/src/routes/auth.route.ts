import { Express } from 'express';
import container from '../dependency-injection';
import AuthLoginController from '../controllers/auth-login-controller';
import { LoginLimiter } from '../middlewares/login-limiter';
import { AuthMiddleware } from '@powerconnect/shared';

export const register = (app: Express): void => {
  const authMiddleware: AuthMiddleware = container.get('Shared.JwtMiddleware');

  const statusGetController = container.get('Apps.controllers.StatusGetController');
  app.get('/api/auth/status', statusGetController.run.bind(statusGetController));

  const authLoginController: AuthLoginController = container.get('Apps.controllers.AuthLoginController');
  app.post(
    '/api/auth/login',
    LoginLimiter,
    AuthLoginController.validator(),
    authLoginController.run.bind(authLoginController)
  );

  const authSignUpController = container.get('Apps.controllers.AuthSignUpController');
  app.post('/api/auth/signup', authSignUpController.run.bind(authSignUpController));

  const authLogoutController = container.get('Apps.controllers.AuthLogoutController');
  app.post(
    '/api/auth/logout',
    authMiddleware.validateAccessToken(),
    authLogoutController.run.bind(authLogoutController)
  );

  const authRefreshTokenController = container.get('Apps.controllers.AuthRefreshTokenController');
  app.post(
    '/api/auth/refresh',
    authMiddleware.validateAccessToken(),
    authRefreshTokenController.run.bind(authRefreshTokenController)
  );
};
