import { Request } from 'express';
import { validationResult, ValidationError } from 'express-validator';

export abstract class ValidateFields {
  protected validateRequest(req: Request): Array<ValidationError> {
    const errors = validationResult(req);
    return errors.array();
  }
}
