import { injectable } from 'inversify';
import BlueprintSchema, { Blueprint } from '../models/blueprint.model';
import { BlueprintCreateDTO } from '../Validator/blueprint/blueprintCreate';

@injectable()
export class BlueprintService {
  public async findAll(): Promise<Blueprint[]> {
    return await BlueprintSchema.find();
  }

  public async create(blueprintDTO: BlueprintCreateDTO): Promise<Blueprint> {
    const { name, points } = blueprintDTO;

    const blueprint = await BlueprintSchema.findOne({ name });

    if (blueprint) {
      throw `A blueprint named ${name} already exists`;
    }

    return await BlueprintSchema.create({ name, points });
  }

  public async findById(id: string): Promise<Blueprint> {
    return await BlueprintSchema.findById(id);
  }

  public async delete(id: string): Promise<Blueprint> {
    return await BlueprintSchema.findByIdAndDelete(id);
  }
}
