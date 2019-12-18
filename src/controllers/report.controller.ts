import { inject } from 'inversify';
import { BaseHttpController, controller, httpGet } from 'inversify-express-utils';
import {
  BadRequestErrorMessageResult as BadRequest,
  JsonResult,
} from 'inversify-express-utils/dts/results';
import { TYPES } from '../ioc/container';
import { ReportService } from '../services/report.service';
import { Item } from '../models/item.model';

@controller('/reports')
export class ReportController extends BaseHttpController {
  constructor(
    @inject(TYPES.ReportService)
    private reportService: ReportService,
  ) {
    super();
  }

  @httpGet('/')
  public async index(): Promise<JsonResult | BadRequest> {
    try {
      const infectedPercentage = await this.reportService.infectedPercentage();
      const healthyPercentage = await this.reportService.healthyPercentage();
      const pointsLost = await this.reportService.pointsLost();
      const averageResources = await this.reportService.averageResources();

      return this.json({
        infectedPercentage,
        healthyPercentage,
        pointsLost,
        averageResources,
      });
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpGet('/infected')
  public async infected(): Promise<JsonResult | BadRequest> {
    try {
      const infectedPercentage = await this.reportService.infectedPercentage();
      return this.json({ infectedPercentage });
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpGet('/healthy')
  public async nonInfected(): Promise<JsonResult | BadRequest> {
    try {
      const healthyPercentage = await this.reportService.healthyPercentage();
      return this.json({ healthyPercentage });
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpGet('/average-resources')
  public async averageResources(): Promise<JsonResult | BadRequest> {
    try {
      const averageResources = await this.reportService.averageResources();
      return this.json({ averageResources });
    } catch (err) {
      return this.badRequest(err);
    }
  }

  @httpGet('/points-lost')
  public async pointsLost(): Promise<JsonResult | BadRequest> {
    try {
      const pointsLost = await this.reportService.pointsLost();
      return this.json({ pointsLost });
    } catch (err) {
      return this.badRequest(err);
    }
  }
}
