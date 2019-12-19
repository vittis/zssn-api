import { injectable } from 'inversify';
import { IoCContainer, TYPES } from '../ioc/container';
import SurvivorSchema, { Survivor } from '../models/survivor.model';
import { BlueprintService } from './blueprint.service';
import { ItemService } from './item.service';
import ItemSchema, { Item } from '../models/item.model';
import { Blueprint } from '../models/blueprint.model';
import { SurvivorCreateDTO } from '../Validator/survivor/survivorCreate';
import { SurvivorUpdateDTO } from '../Validator/survivor/survivorUpdate';
import { ReportInfectionDTO } from '../Validator/survivor/reportInfection';
import { TradeDTO } from '../Validator/survivor/survivorTrade';

@injectable()
export class SurvivorService {
  // eslint-disable-next-line prettier/prettier
  private blueprintService = IoCContainer.inject(TYPES.BlueprintService) as BlueprintService;
  private itemsService = IoCContainer.inject(TYPES.ItemService) as ItemService;

  public async findAll(): Promise<Survivor[]> {
    return await SurvivorSchema.find();
  }

  public async create(survivorDto: SurvivorCreateDTO): Promise<Survivor> {
    const { name, gender, age, coordinates, items } = survivorDto;

    // check if name exists
    const survivor = await SurvivorSchema.findOne({ name });
    if (survivor) {
      throw `A survivor named ${name} already exists`;
    }

    const newSurvivor = new SurvivorSchema({
      name,
      gender,
      age,
      loc: {
        type: 'Point',
        coordinates,
      },
    });

    const blueprints = await this.blueprintService.findAll();

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

    const createdSurvivor = await newSurvivor.save();

    await ItemSchema.create(itemsToAdd);

    return createdSurvivor;
  }

  public async findById(id: string): Promise<Survivor> {
    return await SurvivorSchema.findById(id);
  }

  public async update(id: string, survivorDto: SurvivorUpdateDTO): Promise<Survivor> {
    // separate coordinates from other data
    const { coordinates, ...rest } = survivorDto;

    // check if name already exists
    if (rest.name) {
      const survivor = await SurvivorSchema.findOne({ name: rest.name });
      if (survivor) {
        throw `A survivor named ${rest.name} already exists`;
      }
    }

    // find and update
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

  public async findAllItems(id: string): Promise<Item[]> {
    const survivor = await this.findById(id);
    if (!survivor) {
      throw `Survivor id "${id}" not found`;
    }

    return await this.itemsService.findAllFromSurvivor(id);
  }

  public async trade(id: string, tradeDTO: TradeDTO): Promise<void> {
    const { recipientId, givenItems, offeredItems } = tradeDTO;

    // check if participants exist
    const sender = await this.findById(id);
    if (!sender) {
      throw `Sender survivor id "${id}" not found`;
    }
    const recipient = await this.findById(recipientId);
    if (!recipient) {
      throw `Recipient survivor id "${id}" not found`;
    }

    // check if infected
    if (sender.infected || recipient.infected) {
      throw `Can't perform trade with infected survivors`;
    }

    // check if participants have the items
    const senderItems = await this.itemsService.findAllFromSurvivor(id);
    const senderHasItems = await this.hasItems(id, senderItems, givenItems);
    if (!senderHasItems) {
      throw `Sender doesn't have the items`;
    }
    const recipientItems = await this.itemsService.findAllFromSurvivor(recipientId);
    const recipientHasItems = await this.hasItems(
      recipientId,
      recipientItems,
      offeredItems,
    );
    if (!recipientHasItems) {
      throw `Recipient doesn't have the items`;
    }

    const isTradeIsFair = await this.isTradeIsFair(givenItems, offeredItems);
    if (!isTradeIsFair) {
      throw 'Items points do not match';
    }

    this.confirmTrade(
      senderItems,
      givenItems,
      recipientItems,
      offeredItems,
      id,
      recipientId,
    );
  }

  public async isTradeIsFair(
    givenItems: Partial<Item>[],
    offeredItems: Partial<Item>[],
  ): Promise<boolean> {
    const blueprints = await this.blueprintService.findAll();
    const senderTotalPoints = this.calculateTotalPoints(givenItems, blueprints);
    const recipientTotalPoints = this.calculateTotalPoints(offeredItems, blueprints);
    if (senderTotalPoints !== recipientTotalPoints) {
      return false;
    }
    return true;
  }

  public async confirmTrade(
    senderItems: Item[],
    givenItems: Partial<Item>[],
    recipientItems: Item[],
    offeredItems: Partial<Item>[],
    senderId: string,
    recipientId: string,
  ): Promise<void> {
    /* Remove items from inventory */
    givenItems.forEach(async itemToGive => {
      const item = senderItems.find(item => item.item.id === itemToGive.id);
      if (item.quantity === itemToGive.quantity) {
        await ItemSchema.findByIdAndDelete(item.id);
      } else {
        await ItemSchema.findOneAndUpdate(
          { _id: item.id },
          { quantity: item.quantity - itemToGive.quantity },
        );
      }
    });

    offeredItems.forEach(async itemToReceive => {
      const item = recipientItems.find(item => item.item.id === itemToReceive.id);
      if (item.quantity === itemToReceive.quantity) {
        await ItemSchema.findByIdAndDelete(item.id);
      } else {
        await ItemSchema.findOneAndUpdate(
          { _id: item.id },
          { quantity: item.quantity - itemToReceive.quantity },
        );
      }
    });

    /* Add items to inventory */
    const updatedSenderItems = await this.itemsService.findAllFromSurvivor(senderId);
    const updatedRecipientItems = await this.itemsService.findAllFromSurvivor(
      recipientId,
    );
    givenItems.forEach(async itemToGive => {
      const item = updatedRecipientItems.find(item => item.item.id === itemToGive.id);
      if (!item) {
        await ItemSchema.create({
          quantity: itemToGive.quantity,
          item: itemToGive.id,
          owner: recipientId,
        });
      } else {
        await ItemSchema.findOneAndUpdate(
          { _id: item.id },
          { quantity: item.quantity + itemToGive.quantity },
        );
      }
    });

    offeredItems.forEach(async itemToReceive => {
      const item = updatedSenderItems.find(item => item.item.id === itemToReceive.id);
      if (!item) {
        await ItemSchema.create({
          quantity: itemToReceive.quantity,
          item: itemToReceive.id,
          owner: senderId,
        });
      } else {
        await ItemSchema.findOneAndUpdate(
          { _id: item.id },
          { quantity: item.quantity + itemToReceive.quantity },
        );
      }
    });
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

  public async hasItems(
    id: string,
    survivorItems: Item[],
    items: Partial<Item>[],
  ): Promise<boolean> {
    const mutualItems = items.filter(item =>
      survivorItems.some(
        senderItem =>
          senderItem.item.id === item.id && senderItem.quantity >= item.quantity,
      ),
    );

    return mutualItems.length === items.length;
  }

  public calculateTotalPoints(items: Partial<Item>[], blueprints: Blueprint[]): number {
    const totalPoints = items.reduce(
      (acc, item) => acc + item.quantity * blueprints.find(b => b.id === item.id).points,
      0,
    );
    return totalPoints;
  }
}
