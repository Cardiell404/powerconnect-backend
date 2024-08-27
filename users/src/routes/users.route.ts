import { Express } from 'express';
import container from '../dependency-injection';

export const register = (app: Express): void => {
  const authMiddleware = container.get('Shared.JwtMiddleware');

  const statusGetController = container.get('Apps.controllers.StatusGetController');
  app.get('/api/users/status', statusGetController.run.bind(statusGetController));

  const getCurrentUserController = container.get('Apps.controllers.GetCurrentUserController');
  app.get(
    '/api/users/current',
    authMiddleware.validateAccessToken(),
    getCurrentUserController.run.bind(getCurrentUserController)
  );

  const getUserByIdController = container.get('Apps.controllers.GetUserByIdController');
  app.get('/api/users/:id', getUserByIdController.run.bind(getUserByIdController));



  // const updateUserController = container.get('Apps.controllers.UpdateUserController');
  // app.patch('/api/users/:id', updateUserController.run.bind(updateUserController));

  // const getAllUsersController = container.get('Apps.controllers.GetAllUsersController');
  // app.post('/api/users/search', getAllUsersController.run.bind(getAllUsersController));
};
