/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
import { UsersBackendApp } from './users-backend-app';

try {
  new UsersBackendApp().start();
} catch (e) {
  console.log(e);
  process.exit(1);
}

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
  process.exit(1);
});
