import { injectable } from 'inversify';
import ItemSchema, { Item } from '../models/item.model';
import { IoCContainer, TYPES } from '../ioc/container';
import { ItemService } from './item.service';
import { SurvivorService } from './survivor.service';
import { BlueprintService } from './blueprint.service';

@injectable()
export class ReportService {
  private itemsService = IoCContainer.inject(TYPES.ItemService) as ItemService;
  private survivorService = IoCContainer.inject(TYPES.SurvivorService) as SurvivorService;
  private blueprintService = IoCContainer.inject(
    TYPES.BlueprintService,
  ) as BlueprintService;

  public async infectedPercentage(): Promise<number> {
    const allSurvivors = await this.survivorService.findAll();
    const infectedSurvivors = allSurvivors.filter(survivor => survivor.infected);
    if (infectedSurvivors.length === 0 || allSurvivors.length === 0) {
      return 0;
    }
    return infectedSurvivors.length / allSurvivors.length;
  }

  public async healthyPercentage(): Promise<number> {
    const infectedPercentage = await this.infectedPercentage();
    return 1 - infectedPercentage;
  }

  public async averageResources(): Promise<any> {
    const blueprints = await this.blueprintService.findAll();
    const allItems = await this.itemsService.findAll();
    const allSurvivors = await this.survivorService.findAll();
    if (allSurvivors.length === 0) {
      return 0;
    }

    const averageResources = blueprints.map(blueprint => {
      const resources = allItems.filter(({ item }) => item.id === blueprint.id);
      const totalQuantity = resources.reduce(
        (acc, resource) => acc + resource.quantity,
        0,
      );

      return { [`${blueprint.name}`]: totalQuantity / allSurvivors.length };
    });

    return averageResources;
  }

  public async pointsLost(): Promise<any> {
    const allSurvivors = await this.survivorService.findAll();
    const infectedSurvivors = allSurvivors.filter(survivor => survivor.infected);
    const blueprints = await this.blueprintService.findAll();

    const lostPointsPerSurvivor = await Promise.all(
      infectedSurvivors.map(async survivor => {
        const survivorItems = await this.survivorService.findAllItems(survivor.id);
        const formattedItems = survivorItems.map(item => {
          return { id: item.item.id, quantity: item.quantity };
        });
        return this.survivorService.calculateTotalPoints(formattedItems, blueprints);
      }),
    );

    const lostPoints = lostPointsPerSurvivor.reduce((acc, value) => acc + value, 0);

    return lostPoints;
  }

  public async blueprintsFound(): Promise<number> {
    const allBlueprints = await this.blueprintService.findAll();

    return allBlueprints.length;
  }
}
