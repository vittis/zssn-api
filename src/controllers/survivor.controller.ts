import { Request, Response, NextFunction } from 'express';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPut,
} from 'inversify-express-utils';
import { SurvivorService } from '../services/survivor.service';
import { JsonResult } from 'inversify-express-utils/dts/results';
import { TYPES } from '../config/container';

@controller('/survivors')
export class SurvivorController extends BaseHttpController {
  constructor(
    @inject(TYPES.SurvivorService) private survivorService: SurvivorService,
  ) {
    super();
  }

  @httpGet('/')
  public async index(): Promise<JsonResult> {
    return this.json({ method: 'index' }, 200);
  }

  @httpGet('/:id')
  public async show(req: Request, res: Response): Promise<JsonResult> {
    return this.json({ method: 'show' }, 200);
  }

  @httpPost('/')
  public async store(req: Request, res: Response): Promise<JsonResult> {
    return this.json({ method: 'store' }, 201);
  }

  @httpPut('/:id')
  public async update(req: Request, res: Response): Promise<JsonResult> {
    return this.json({ method: 'update' }, 201);
  }

  @httpDelete('/:id')
  public async destroy(req: Request, res: Response): Promise<JsonResult> {
    return this.json({ method: 'destroy' }, 200);
  }
}
