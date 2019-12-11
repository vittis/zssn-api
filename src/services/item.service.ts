import { injectable } from 'inversify';
import ItemSchema, { Item } from '../models/item.model';

@injectable()
export class ItemService {
  public async findAll(): Promise<Item[]> {
    return await ItemSchema.find()
      .populate('item')
      .populate('owner');
  }

  public async create(blueprint: Item): Promise<Item> {
    return await ItemSchema.create(blueprint);
  }

  public async findById(id: number) {
    //
  }

  public async delete(id: number) {
    //
  }
}
