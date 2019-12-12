import { injectable } from 'inversify';
import _ from 'lodash';
import { IoCContainer, TYPES } from '../ioc/container';
import SurvivorSchema, { Survivor } from '../models/survivor.model';
import { BlueprintService } from './blueprint.service';
import ItemSchema from '../models/item.model';
import { SurvivorCreateDTO } from '../Validator/survivor/survivorCreate';
import { SurvivorUpdateDTO } from '../Validator/survivor/survivorUpdate';

@injectable()
export class SurvivorService {
  blueprintService = IoCContainer.inject(TYPES.BlueprintService) as BlueprintService;

  public async findAll(): Promise<Survivor[]> {
    return await SurvivorSchema.find();
  }

  public async create(survivorDto: SurvivorCreateDTO): Promise<Survivor> {
    const { name, gender, age, lon, lat, items } = survivorDto;

    const survivor = await SurvivorSchema.findOne({ name });

    if (survivor) {
      throw `A survivor named ${name} already exists`;
    }

    const blueprints = await this.blueprintService.findAll();

    const newSurvivor = new SurvivorSchema({
      name,
      gender,
      age,
      loc: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    });

    const itemsToAdd = items.map(item => {
      const blueprint = _.find(blueprints, { id: item.id });
      if (!blueprint) {
        throw `Blueprint id "${item.id}" not found`;
      }
      return new ItemSchema({
        quantity: item.quantity,
        item: blueprint.id,
        owner: newSurvivor.id,
      });
    });

    const survivorModel = await newSurvivor.save();

    await ItemSchema.create(itemsToAdd);

    return survivorModel;
  }

  public async findById(id: string): Promise<Survivor> {
    return await SurvivorSchema.findById(id);
  }

  public async update(id: string, survivorDto: SurvivorUpdateDTO): Promise<Survivor> {
    const survivor = await SurvivorSchema.findOneAndUpdate({ _id: id }, survivorDto, {
      new: true,
    });
    if (!survivor) {
      throw `Survivor id "${id}" not found`;
    }
    return survivor;
  }

  public async delete(id: string): Promise<Survivor> {
    return await SurvivorSchema.findByIdAndDelete(id);
  }
}
