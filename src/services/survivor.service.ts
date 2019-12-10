import { injectable } from 'inversify';

@injectable()
export class SurvivorService {
  public get(): void {
    console.log('get');
  }
}
