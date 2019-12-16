/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { BlueprintService } from '../../services/blueprint.service';
import { BlueprintController } from '../../controllers/blueprint.controller';
import { Blueprint } from '../../models/blueprint.model';

describe('Blueprint controller', () => {
  let blueprintService: BlueprintService;
  let blueprintController: BlueprintController;

  beforeAll(async () => {
    blueprintService = new BlueprintService();
    blueprintController = new BlueprintController(blueprintService);
  });

  it('should return blueprints on index', async () => {
    const blueprints: any[] = [
      {
        _id: '5df7c5bbd26938002840e25f',
        name: 'Ammunition',
        points: 1,
        __v: 0,
      },
      {
        _id: '5df7c5ccd26938002840e260',
        name: 'Water',
        points: 3,
        __v: 0,
      },
    ];
    const mockSpy = jest.spyOn(blueprintService, 'findAll');
    mockSpy.mockImplementation(() => {
      return Promise.resolve(blueprints);
    });
    const response = await blueprintController.index();
    expect(response).toEqual(blueprints);
  });

  it('should return blueprint on show', async () => {
    const blueprints: any = [
      {
        _id: '5df7c5bbd26938002840e25f',
        name: 'Ammunition',
        points: 1,
        __v: 0,
      },
      {
        _id: '5df7c5ccd26938002840e260',
        name: 'Water',
        points: 3,
        __v: 0,
      },
    ];
    blueprintService.findById = jest.fn(() => {
      return Promise.resolve(blueprints[0]);
    });

    const req: any = {
      params: {
        id: 0,
      },
    };
    const response = await blueprintController.show(req);
    expect(response).toEqual(blueprints[0]);
  });
});
