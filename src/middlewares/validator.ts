import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';

@injectable()
export class ValidationMiddleware extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction) {
    console.log('middle nice');
    next();
  }
}
