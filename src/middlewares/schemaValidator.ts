import { injectable } from 'inversify';
import { BaseMiddleware } from 'inversify-express-utils';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import Joi from 'joi';
import Schemas from '../Validator';

@injectable()
export class SchemaValidator extends BaseMiddleware {
  public handler(req: Request, res: Response, next: NextFunction): void {
    // Joi validation options
    const validationOptions = {
      abortEarly: false, // abort after the last validation error
      allowUnknown: true, // allow unknown keys that will be ignored
      stripUnknown: true, // remove unknown keys from the validated data
    };
    const route = req.route.path;
    const method = req.method.toLowerCase();

    const { schema } = Schemas.find(o => o.path === route && o.method === method) || {};

    if (schema) {
      // Validate req.body using the schema and validation options
      return Joi.validate(req.body, schema, validationOptions, (err, data) => {
        if (err) {
          const JoiError = {
            status: 'failed',
            error: {
              original: err._object,

              // fetch only message and type from each error
              details: _.map(err.details, ({ message, type }) => ({
                message: message.replace(/['"]/g, ''),
                type,
              })),
            },
          };

          res.status(422).json(JoiError);
        } else {
          req.body = data;
          next();
        }
      });
    }

    next();
  }
}
