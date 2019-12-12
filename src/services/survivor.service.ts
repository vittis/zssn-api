import { injectable } from 'inversify';
import _ from 'lodash';
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
    survivorDto: SurvivorCreateDTO,
    blueprints: Blueprint[],
  ): Promise<Survivor> {
    const { name, gender, age, lon, lat, items } = survivorDto;
    console.log(items);
    const survivor = new SurvivorSchema({
      name,
      gender,
      age,
      loc: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    });

    //_.find(blueprints, {_id: })

    const itemId = blueprints[0].id;

    const item = new ItemSchema({
      quantity: 1,
      item: itemId,
      owner: survivor.id,
    });

    const survivorModel = await survivor.save();
    await item.save();

    return survivorModel;
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
