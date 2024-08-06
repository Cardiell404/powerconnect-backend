import sharedContainer from '../shared/application';
import { AuthLoginController } from '../../controllers/auth-login-controller';
import StatusGetController from '../../controllers/status-get-controller';
import { AuthCurrentUserController } from '../../controllers/auth-current-user-controller';
import AuthSignOutController from '../../controllers/auth-sign-out-controller';

const appContainer = sharedContainer;
appContainer.register('Apps.controllers.StatusGetController', StatusGetController);

appContainer.register('Apps.controllers.AuthLoginController', AuthLoginController, [
  appContainer.get('Shared.QueryBus'),
  appContainer.get('Shared.Crypto')
]);

appContainer.register('Apps.controllers.AuthCurrentUserController', AuthCurrentUserController, [
  appContainer.get('Shared.QueryBus')
]);

appContainer.register('Apps.controllers.AuthSignOutController', AuthSignOutController);

export default appContainer;
