import { injectable } from 'inversify';
import { IoCContainer, TYPES } from '../ioc/container';
import SurvivorSchema, { Survivor } from '../models/survivor.model';
import { BlueprintService } from './blueprint.service';
import ItemSchema from '../models/item.model';
import { SurvivorCreateDTO } from '../Validator/survivor/survivorCreate';
import { SurvivorUpdateDTO } from '../Validator/survivor/survivorUpdate';
import { ReportInfectionDTO } from '../Validator/survivor/reportInfection';

@injectable()
export class SurvivorService {
  blueprintService = IoCContainer.inject(TYPES.BlueprintService) as BlueprintService;

  public async findAll(): Promise<Survivor[]> {
    return await SurvivorSchema.find();
  }

  public async create(survivorDto: SurvivorCreateDTO): Promise<Survivor> {
    const { name, gender, age, coordinates, items } = survivorDto;

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
        coordinates,
      },
    });

    const itemsToAdd = items.map(item => {
      const blueprint = blueprints.find(o => o.id === item.id);
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
    const { coordinates, ...rest } = survivorDto;

    if (rest.name) {
      const survivor = await SurvivorSchema.findOne({ name: rest.name });

      if (survivor) {
        throw `A survivor named ${rest.name} already exists`;
      }
    }

    const updatedSurvivor = await SurvivorSchema.findOneAndUpdate(
      { _id: id },
      {
        ...rest,
        // Add object property conditionally
        ...(coordinates && {
          loc: {
            type: 'Point',
            coordinates,
          },
        }),
      },
      {
        new: true,
      },
    );

    if (!updatedSurvivor) {
      throw `Survivor id "${id}" not found`;
    }
    return updatedSurvivor;
  }

  public async delete(id: string): Promise<Survivor> {
    return await SurvivorSchema.findByIdAndDelete(id);
  }

  public async reportInfection(
    id: string,
    reportInfectionDTO: ReportInfectionDTO,
  ): Promise<Survivor> {
    const { infectedId } = reportInfectionDTO;

    if (id === infectedId) {
      throw `A survivor can't report himself`;
    }

    const survivor = await this.findById(id);
    if (!survivor) {
      throw `Survivor reporting the infection does not exist`;
    }

    const reportedSurvivor = await this.findById(infectedId);
    if (!reportedSurvivor) {
      throw `Reported survivor does not exist`;
    }

    const alreadyReported = reportedSurvivor.reportedBy.includes(id);
    if (alreadyReported) {
      throw `Survivors can't be reported twice by the same survivor`;
    }

    if (reportedSurvivor.reportedBy.length >= 2) {
      // Set as infected and increment infection report count
      return await SurvivorSchema.findOneAndUpdate(
        { _id: infectedId },
        { infected: true, reportedBy: [...reportedSurvivor.reportedBy, id] },
        {
          new: true,
        },
      );
    }

    // Increment infection report count
    return await SurvivorSchema.findOneAndUpdate(
      { _id: infectedId },
      { reportedBy: [...reportedSurvivor.reportedBy, id] },
      {
        new: true,
      },
    );
  }
}
