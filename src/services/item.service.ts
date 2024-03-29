import { injectable } from 'inversify';
import ItemSchema, { Item } from '../models/item.model';

@injectable()
export class ItemService {
  public async findAll(): Promise<Item[]> {
    return await ItemSchema.find().populate('item');
  }

  public async findAllFromSurvivor(survivorId: string): Promise<Item[]> {
    return await ItemSchema.find({ owner: survivorId }).populate('item');
  }
}
