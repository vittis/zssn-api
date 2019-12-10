import { Container } from 'inversify';
import { SurvivorService } from '../services/survivor.service';

export const TYPES = {
  SurvivorService: Symbol.for('SurvivorService'),
};

export class ContainerConfigLoader {
  public static Load(): Container {
    const container = new Container();
    container.bind<SurvivorService>(TYPES.SurvivorService).to(SurvivorService);
    return container;
  }
}
