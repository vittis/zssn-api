import { Request, Response } from 'express';
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
import { BlueprintService } from '../services/blueprint.service';
import {
  JsonResult,
  BadRequestErrorMessageResult as BadRequest,
} from 'inversify-express-utils/dts/results';
import { TYPES } from '../config/container';
import { Survivor } from '../models/survivor.model';

@controller('/survivors')
export class SurvivorController extends BaseHttpController {
  constructor(
    @inject(TYPES.SurvivorService) private survivorService: SurvivorService,
    @inject(TYPES.BlueprintService)
    private blueprintService: BlueprintService,
  ) {
    super();
  }

  @httpGet('/')
  public async index(): Promise<Survivor[] | BadRequest> {
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

  @httpPost('/', TYPES.SchemaValidator)
  public async store(req: Request): Promise<Survivor | BadRequest> {
    try {
      const blueprints = await this.blueprintService.findAll();
      return await this.survivorService.create(req.body, blueprints);
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
