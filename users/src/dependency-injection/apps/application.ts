import sharedContainer from '../shared/application';
import StatusGetController from '../../controllers/status-get-controller';
import { GetUserByIdController } from '../../controllers/get-user-by-id-controller';
import { GetCurrentUserController } from '../../controllers/get-current-user-controller';

const appContainer = sharedContainer;

appContainer.register('Apps.controllers.StatusGetController', StatusGetController);
appContainer.register('Apps.controllers.GetUserByIdController', GetUserByIdController, [
  appContainer.get('Shared.QueryBus')
]);
appContainer.register('Apps.controllers.GetCurrentUserController', GetCurrentUserController, [
  appContainer.get('Shared.QueryBus')
]);
export default appContainer;
