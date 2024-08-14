import sharedContainer from '../shared/application';
import StatusGetController from '../../controllers/status-get-controller';
import { CreateCustomerController } from '../../controllers/create-customer-controller';
import { GetAllCustomersController } from '../../controllers/get-all-customers-controller';
import { GetCustomerByIdController } from '../../controllers/get-customer-by-id-controller';
import { UpdateCustomerController } from '../../controllers/update-customer-controller';
import { DeleteCustomerController } from '../../controllers/delete-customer-controller';

const appContainer = sharedContainer;
appContainer.register('Apps.controllers.StatusGetController', StatusGetController);

appContainer.register('Apps.controllers.CreateCustomerController', CreateCustomerController, [
  appContainer.get('Shared.CommandBus')
]);

appContainer.register('Apps.controllers.GetAllCustomersController', GetAllCustomersController, [
  appContainer.get('Shared.QueryBus')
]);

appContainer.register('Apps.controllers.GetCustomerByIdController', GetCustomerByIdController, [
  appContainer.get('Shared.QueryBus')
]);

appContainer.register('Apps.controllers.UpdateCustomerController', UpdateCustomerController, [
  appContainer.get('Shared.CommandBus')
]);

appContainer.register('Apps.controllers.DeleteCustomerController', DeleteCustomerController, [
  appContainer.get('Shared.CommandBus')
]);

export default appContainer;
