/* eslint-disable no-console */
import { NextFunction, Request, Response } from 'express';
import { JwtImplement } from '../domain/jwt-implement';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export class AuthMiddleware {
  constructor(private jwtImplement: JwtImplement) {}

  validateAccessToken(): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res.status(401).send({ error: 'Authorization header missing' });
      }
      const token = authHeader.split(' ')[1];

      if (!token) {
        return res.status(401).send({ error: 'Token missing from Authorization header' });
      }
      try {
        const payload = this.jwtImplement.verifyRefreshToken(token);
        req.user = payload;
        next();
      } catch (error) {
        return res.status(401).send({ error: 'Invalid or expiren token' });
      }
    };
  }
}
