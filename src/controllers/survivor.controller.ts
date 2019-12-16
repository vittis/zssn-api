import { Request } from 'express';
import { inject } from 'inversify';
import {
  BaseHttpController,
  controller,
  httpDelete,
  httpGet,
  httpPost,
  httpPatch,
} from 'inversify-express-utils';
import { SurvivorService } from '../services/survivor.service';
import {
  BadRequestErrorMessageResult as BadRequest,
  OkResult,
  NotFoundResult,
} from 'inversify-express-utils/dts/results';
import { TYPES } from '../ioc/container';
import { Survivor } from '../models/survivor.model';
import { Item } from '../models/item.model';

@controller('/survivors')
export class SurvivorController extends BaseHttpController {
  constructor(@inject(TYPES.SurvivorService) private survivorService: SurvivorService) {
    super();
  }

  @httpGet('/')
  public async index(): Promise<Survivor[] | BadRequest> {
    try {
      return await this.survivorService.findAll();
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpGet('/:id')
  public async show(req: Request): Promise<Survivor | BadRequest | NotFoundResult> {
    try {
      const survivor = await this.survivorService.findById(req.params.id);
      if (!survivor) {
        return this.notFound();
      }
      return survivor;
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpPost('/', TYPES.SchemaValidator)
  public async store(req: Request): Promise<Survivor | BadRequest> {
    try {
      return await this.survivorService.create(req.body);
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpPatch('/:id', TYPES.SchemaValidator)
  public async update(req: Request): Promise<Survivor | BadRequest> {
    try {
      const survivor = await this.survivorService.update(req.params.id, req.body);
      return survivor;
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpDelete('/:id')
  public async destroy(req: Request): Promise<OkResult | BadRequest> {
    try {
      await this.survivorService.delete(req.params.id);
      return this.ok();
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpPost('/:id/report-infection', TYPES.SchemaValidator)
  public async reportInfection(req: Request): Promise<Survivor | BadRequest> {
    try {
      return await this.survivorService.reportInfection(req.params.id, req.body);
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpPost('/:id/trade', TYPES.SchemaValidator)
  public async trade(req: Request): Promise<void | BadRequest> {
    try {
      return await this.survivorService.trade(req.params.id, req.body);
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpGet('/:id/items', TYPES.SchemaValidator)
  public async getItems(req: Request): Promise<Item[] | BadRequest> {
    try {
      return await this.survivorService.findAllItems(req.params.id);
    } catch (err) {
      return this.badRequest(err);
    }
  }
}
