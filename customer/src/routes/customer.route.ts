import { Express } from 'express';
import container from '../dependency-injection';
import { CreateCustomerController } from '../controllers/create-customer-controller';

export const register = (app: Express): void => {
  const statusGetController = container.get('Apps.controllers.StatusGetController');
  app.get('/api/customers/status', statusGetController.run.bind(statusGetController));

  const createCustomerController: CreateCustomerController = container.get('Apps.controllers.CreateCustomerController');
  app.post('/api/customers', createCustomerController.run.bind(createCustomerController));

  const getAllCustomersController = container.get('Apps.controllers.GetAllCustomersController');
  app.get('/api/customers', getAllCustomersController.run.bind(getAllCustomersController));

  const getCustomerByIdController = container.get('Apps.controllers.GetCustomerByIdController');
  app.get('/api/customers/:id', getCustomerByIdController.run.bind(getCustomerByIdController));

  const updateCustomerController = container.get('Apps.controllers.UpdateCustomerController');
  app.put('/api/customers/:id', updateCustomerController.run.bind(updateCustomerController));

  const deleteCustomerController = container.get('Apps.controllers.DeleteCustomerController');
  app.delete('/api/customers/:id', deleteCustomerController.run.bind(deleteCustomerController));
};
