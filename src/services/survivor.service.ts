import { injectable, inject } from 'inversify';
import SurvivorSchema, { Survivor } from '../models/survivor.model';
import ItemSchema from '../models/item.model';
import { TYPES } from '../config/container';
import { Blueprint } from '../models/blueprint.model';

@injectable()
export class SurvivorService {
  public async findAll(): Promise<Survivor[]> {
    return await SurvivorSchema.find();
  }

  public async create(
    survivorData: Survivor,
    items: Blueprint[],
  ): Promise<Survivor> {
    // eslint-disable-next-line
    try {
      const survivor = new SurvivorSchema({
        ...survivorData,
        loc: {
          type: 'Point',
          coordinates: [-73.97, 40.77],
        },
      });

      const itemId = items[0].id;

      const item = new ItemSchema({
        quantity: 1,
        item: itemId,
        owner: survivor.id,
      });

      await item.save();

      return await survivor.save();
    } catch (err) {
      throw err;
    }
  }

  public async findById(id: number) {
    //
  }

  public async update(id: number, survivor: Survivor) {
    //
  }

  public async delete(id: number) {
    //
  }
}
