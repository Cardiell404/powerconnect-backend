/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */

import { ReportsBackendApp } from './reports-backend-app';

try {
  new ReportsBackendApp().start();
} catch (e) {
  console.log(e);
  process.exit(1);
}

process.on('uncaughtException', err => {
  console.log('uncaughtException', err);
  process.exit(1);
});
