import sharedContainer from '../shared/application';
import AuthLoginController from '../../controllers/auth-login-controller';
import StatusGetController from '../../controllers/status-get-controller';
import AuthRefreshTokenController from '../../controllers/auth-refresh-token-controller';
import AuthSignUpController from '../../controllers/auth-signup-controller';
import AuthLogoutController from '../../controllers/auth-logout-controller';

const appContainer = sharedContainer;
appContainer.register('Apps.controllers.StatusGetController', StatusGetController);

appContainer.register('Apps.controllers.AuthLoginController', AuthLoginController, [
  appContainer.get('Auth.AuthService')
]);

appContainer.register('Apps.controllers.AuthSignUpController', AuthSignUpController, [
  appContainer.get('Shared.CommandBus')
]);

appContainer.register('Apps.controllers.AuthLogoutController', AuthLogoutController, [
  appContainer.get('Shared.CommandBus')
]);

appContainer.register('Apps.controllers.AuthRefreshTokenController', AuthRefreshTokenController, [
  appContainer.get('Shared.QueryBus')
]);

export default appContainer;
