import { injectable } from 'inversify';
import SurvivorSchema, { Survivor } from '../models/survivor.model';
import ItemSchema from '../models/item.model';
import { Blueprint } from '../models/blueprint.model';
import { SurvivorCreateDTO } from '../Validator/survivor/survivorCreate';

@injectable()
export class SurvivorService {
  public async findAll(): Promise<Survivor[]> {
    return await SurvivorSchema.find();
  }

  public async create(
    survivorData: SurvivorCreateDTO,
    items: Blueprint[],
  ): Promise<Survivor> {
    const { name, gender, age, lon, lat } = survivorData;

    const survivor = new SurvivorSchema({
      name,
      gender,
      age,
      loc: {
        type: 'Point',
        coordinates: [lon, lat],
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
