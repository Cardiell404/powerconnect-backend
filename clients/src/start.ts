/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
import { ClientsBackendApp } from './clients-backend-app';

try {
  new ClientsBackendApp().start();
} catch (e) {
  console.log(e);
  process.exit(1);
}

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
  process.exit(1);
});
