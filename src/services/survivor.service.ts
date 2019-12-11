import { injectable } from 'inversify';
import Survivor, { ISurvivor } from '../models/survivor.model';

@injectable()
export class SurvivorService {
  public async findAll(): Promise<ISurvivor[]> {
    return await Survivor.find();
  }

  public async create(survivor: ISurvivor) {
    return await Survivor.create(survivor);
  }

  public async findById(id: number) {
    //
  }

  public async update(id: number, survivor: ISurvivor) {
    //
  }

  public async delete(id: number) {
    //
  }
}
