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
import { ItemService } from '../services/item.service';
import { Item } from '../models/item.model';

@controller('/items')
export class ItemController extends BaseHttpController {
  constructor(
    @inject(TYPES.ItemService)
    private itemService: ItemService,
  ) {
    super();
  }

  @httpGet('/')
  public async index(): Promise<Item[] | BadRequest> {
    try {
      return this.itemService.findAll();
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpPost('/')
  public async store(req: Request): Promise<Item | BadRequest> {
    try {
      return await this.itemService.create(req.body);
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpDelete('/:id')
  public async destroy(req: Request, res: Response): Promise<JsonResult> {
    return this.json({ method: 'destroy' }, 200);
  }
}
