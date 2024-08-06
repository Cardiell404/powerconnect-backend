/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
import { AuthBackendApp } from './auth-backend-app';

try {
  new AuthBackendApp().start();
} catch (e) {
  console.log(e);
  process.exit(1);
}

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
  process.exit(1);
});
