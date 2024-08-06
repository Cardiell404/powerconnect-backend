/* eslint-disable @typescript-eslint/no-var-requires */
import { Router } from 'express';
import glob from 'glob';

export function registerRoutes(router: Router): void {
  const routes = glob.sync(__dirname + '/**/*.route.*');
  routes.map(route => register(route, router));
}

function register(routePath: string, router: Router): void {
  const route = require(routePath);
  route.register(router);
}
