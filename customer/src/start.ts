/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
import { CustomerBackendApp } from './customer-backend-app';

try {
  new CustomerBackendApp().start();
} catch (e) {
  console.log(e);
  process.exit(1);
}

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
  process.exit(1);
});
