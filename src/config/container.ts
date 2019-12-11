import { Container } from 'inversify';
import { SurvivorService } from '../services/survivor.service';
import { BlueprintService } from '../services/blueprint.service';
import { ItemService } from '../services/item.service';
import { SchemaValidator } from '../middlewares/schemaValidator';

export const TYPES = {
  SurvivorService: Symbol.for('SurvivorService'),
  BlueprintService: Symbol.for('BlueprintService'),
  ItemService: Symbol.for('ItemService'),
  SchemaValidator: Symbol.for('SchemaValidator'),
};

export class ContainerConfigLoader {
  public static Load(): Container {
    const container = new Container();
    container.bind<SchemaValidator>(TYPES.SchemaValidator).to(SchemaValidator);

    container.bind<SurvivorService>(TYPES.SurvivorService).to(SurvivorService);
    container.bind<ItemService>(TYPES.ItemService).to(ItemService);
    container
      .bind<BlueprintService>(TYPES.BlueprintService)
      .to(BlueprintService);

    return container;
  }
}
