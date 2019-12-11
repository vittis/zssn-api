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
import {
  JsonResult,
  BadRequestResult,
  BadRequestErrorMessageResult as BadRequest,
} from 'inversify-express-utils/dts/results';
import { TYPES } from '../config/container';
import { ISurvivor } from '../models/survivor.model';

@controller('/survivors')
export class SurvivorController extends BaseHttpController {
  constructor(
    @inject(TYPES.SurvivorService) private survivorService: SurvivorService,
  ) {
    super();
  }

  @httpGet('/')
  public async index(): Promise<ISurvivor[] | BadRequest> {
    try {
      return this.survivorService.findAll();
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpGet('/:id')
  public async show(req: Request, res: Response): Promise<JsonResult> {
    return this.json({ method: 'show' }, 200);
  }

  @httpPost('/')
  public async store(
    req: Request,
    res: Response,
  ): Promise<ISurvivor | BadRequest> {
    try {
      return await this.survivorService.create(req.body);
    } catch (err) {
      return this.badRequest(err);
    }
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
