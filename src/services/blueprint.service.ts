import { injectable } from 'inversify';
import BlueprintSchema, { Blueprint } from '../models/blueprint.model';

@injectable()
export class BlueprintService {
  public async findAll(): Promise<Blueprint[]> {
    return await BlueprintSchema.find();
  }

  public async create(blueprint: Blueprint): Promise<Blueprint> {
    return await BlueprintSchema.create(blueprint);
  }

  public async findById(id: number) {
    //
  }

  public async delete(id: number) {
    //
  }
}
