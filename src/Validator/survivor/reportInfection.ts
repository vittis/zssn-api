import Joi from 'joi';

export interface ReportInfectionDTO {
  infectedId: string;
}

const reportInfectionSchema = Joi.object({
  infectedId: Joi.string().required(),
});

export default {
  path: '/survivors/:id/report-infection',
  method: 'post',
  schema: reportInfectionSchema,
};
