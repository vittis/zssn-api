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

export class IoCContainer {
  private static container: Container;

  public static inject(symbol: symbol) {
    return this.container.get(symbol);
  }

  public static Load(): Container {
    this.container = new Container();

    this.container.bind<SchemaValidator>(TYPES.SchemaValidator).to(SchemaValidator);
    this.container.bind<SurvivorService>(TYPES.SurvivorService).to(SurvivorService);
    this.container.bind<ItemService>(TYPES.ItemService).to(ItemService);
    this.container.bind<BlueprintService>(TYPES.BlueprintService).to(BlueprintService);

    return this.container;
  }
}
