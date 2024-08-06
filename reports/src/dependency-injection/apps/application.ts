import sharedContainer from '../shared/application';
import StatusGetController from '../../controllers/status-get-controller';

const appContainer = sharedContainer;
appContainer.register('Apps.controllers.StatusGetController', StatusGetController);

export default appContainer;
