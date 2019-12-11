import { Container } from 'inversify';
import { SurvivorService } from '../services/survivor.service';
import { BlueprintService } from '../services/blueprint.service';
import { ItemService } from '../services/item.service';
import { ValidationMiddleware } from '../middlewares/validator';

export const TYPES = {
  SurvivorService: Symbol.for('SurvivorService'),
  BlueprintService: Symbol.for('BlueprintService'),
  ItemService: Symbol.for('ItemService'),
  ValidationMiddleware: Symbol.for('ValidationMiddleware'),
};

export class ContainerConfigLoader {
  public static Load(): Container {
    const container = new Container();
    container
      .bind<ValidationMiddleware>(TYPES.ValidationMiddleware)
      .to(ValidationMiddleware);

    container.bind<SurvivorService>(TYPES.SurvivorService).to(SurvivorService);
    container.bind<ItemService>(TYPES.ItemService).to(ItemService);
    container
      .bind<BlueprintService>(TYPES.BlueprintService)
      .to(BlueprintService);

    return container;
  }
}
