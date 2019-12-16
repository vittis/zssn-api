import { Container } from 'inversify';
import { SurvivorService } from '../services/survivor.service';
import { BlueprintService } from '../services/blueprint.service';
import { ItemService } from '../services/item.service';
import { ReportService } from '../services/report.service';
import { SchemaValidator } from '../middlewares/schemaValidator';

export const TYPES = {
  SurvivorService: Symbol.for('SurvivorService'),
  BlueprintService: Symbol.for('BlueprintService'),
  ItemService: Symbol.for('ItemService'),
  ReportService: Symbol.for('ReportService'),
  SchemaValidator: Symbol.for('SchemaValidator'),
};

export class IoCContainer {
  private static container: Container;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static inject(symbol: symbol): any {
    return this.container.get(symbol);
  }

  public static Load(): Container {
    this.container = new Container();

    this.container.bind<SchemaValidator>(TYPES.SchemaValidator).to(SchemaValidator);
    this.container.bind<SurvivorService>(TYPES.SurvivorService).to(SurvivorService);
    this.container.bind<ItemService>(TYPES.ItemService).to(ItemService);
    this.container.bind<BlueprintService>(TYPES.BlueprintService).to(BlueprintService);
    this.container.bind<ReportService>(TYPES.ReportService).to(ReportService);

    return this.container;
  }
}
