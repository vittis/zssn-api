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
import {
  JsonResult,
  BadRequestErrorMessageResult as BadRequest,
} from 'inversify-express-utils/dts/results';
import { TYPES } from '../config/container';
import { BlueprintService } from '../services/blueprint.service';
import { Blueprint } from '../models/blueprint.model';

@controller('/blueprints')
export class BlueprintController extends BaseHttpController {
  constructor(
    @inject(TYPES.BlueprintService)
    private blueprintService: BlueprintService,
  ) {
    super();
  }

  @httpGet('/')
  public async index(): Promise<Blueprint[] | BadRequest> {
    try {
      return this.blueprintService.findAll();
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpPost('/')
  public async store(req: Request): Promise<Blueprint | BadRequest> {
    try {
      return await this.blueprintService.create(req.body);
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpDelete('/:id')
  public async destroy(req: Request, res: Response): Promise<JsonResult> {
    return this.json({ method: 'destroy' }, 200);
  }
}
