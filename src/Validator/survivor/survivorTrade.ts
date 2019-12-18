import Joi from 'joi';

export interface TradeDTO {
  recipientId: string;
  offeredItems: [{ id: string; quantity: number }];
  givenItems: [{ id: string; quantity: number }];
}

const TradeSchema = Joi.object({
  recipientId: Joi.string().required(),
  offeredItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number()
          .integer()
          .positive(),
      }),
    )
    .required(),
  givenItems: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number()
          .integer()
          .positive(),
      }),
    )
    .required(),
});

export default {
  path: '/survivors/:id/trade',
  method: 'post',
  schema: TradeSchema,
};
