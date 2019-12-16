/* eslint-disable @typescript-eslint/no-explicit-any */
import 'reflect-metadata';
import { SurvivorService } from '../../services/survivor.service';
import { SurvivorController } from '../../controllers/survivor.controller';
import { Blueprint } from '../../models/blueprint.model';
import { IoCContainer } from '../../ioc/container';
import { BlueprintService } from '../../services/blueprint.service';

jest.mock('../../ioc/container');

describe('Blueprint controller', () => {
  let survivorService: SurvivorService;
  let survivorController: SurvivorController;

  beforeAll(async () => {
    const inject = jest.fn();
    inject.mockReturnValue(new BlueprintService());

    IoCContainer.inject = inject.bind(IoCContainer);

    survivorService = new SurvivorService();
    survivorController = new SurvivorController(survivorService);
  });

  it('should return survivors on index', async () => {
    const survivors: any[] = [
      {
        loc: {
          type: 'Point',
          coordinates: [121, 23],
        },
        infected: false,
        reportedBy: [],
        _id: '5df7e21265175f005783109c',
        name: 'xxxxx',
        gender: 'F',
        age: 10,
        createdAt: '2019-12-16T19:59:14.960Z',
        updatedAt: '2019-12-16T19:59:14.960Z',
        __v: 0,
      },
      {
        loc: {
          type: 'Point',
          coordinates: [121, 23],
        },
        infected: false,
        reportedBy: [],
        _id: '5df7e21965175f005783109d',
        name: 'Teste',
        gender: 'F',
        age: 10,
        createdAt: '2019-12-16T19:59:21.311Z',
        updatedAt: '2019-12-16T19:59:21.311Z',
        __v: 0,
      },
    ];
    const mockSpy = jest.spyOn(survivorService, 'findAll');
    mockSpy.mockImplementation(() => {
      return Promise.resolve(survivors);
    });
    const response = await survivorController.index();
    expect(response).toEqual(survivors);
  });

  it('should return survivor on show', async () => {
    const survivors: any[] = [
      {
        loc: {
          type: 'Point',
          coordinates: [121, 23],
        },
        infected: false,
        reportedBy: [],
        _id: '5df7e21265175f005783109c',
        name: 'xxxxx',
        gender: 'F',
        age: 10,
        createdAt: '2019-12-16T19:59:14.960Z',
        updatedAt: '2019-12-16T19:59:14.960Z',
        __v: 0,
      },
      {
        loc: {
          type: 'Point',
          coordinates: [121, 23],
        },
        infected: false,
        reportedBy: [],
        _id: '5df7e21965175f005783109d',
        name: 'Teste',
        gender: 'F',
        age: 10,
        createdAt: '2019-12-16T19:59:21.311Z',
        updatedAt: '2019-12-16T19:59:21.311Z',
        __v: 0,
      },
    ];
    survivorService.findById = jest.fn(() => {
      return Promise.resolve(survivors[0]);
    });

    const req: any = {
      params: {
        id: 0,
      },
    };
    const response = await survivorController.show(req);
    expect(response).toEqual(survivors[0]);
  });
});
