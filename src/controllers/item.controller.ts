import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';
import { BadRequestErrorMessageResult as BadRequest } from 'inversify-express-utils/dts/results';
import { TYPES } from '../ioc/container';
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
}
