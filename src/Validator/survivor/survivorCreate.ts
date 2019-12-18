import Joi from 'joi';

export interface SurvivorCreateDTO {
  name: string;
  gender: string;
  age: number;
  coordinates: [number, number];
  items: [{ id: string; quantity: number }];
}

const survivorCreateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100)
    .required(),
  gender: Joi.string()
    .valid(['M', 'F'])
    .uppercase()
    .required(),
  age: Joi.number()
    .integer()
    .positive()
    .required(),
  coordinates: Joi.array()
    .items(
      Joi.number()
        .greater(-181)
        .less(181),
    )
    .required(),
  items: Joi.array()
    .items(
      Joi.object({
        id: Joi.string().required(),
        quantity: Joi.number()
          .integer()
          .positive(),
      }),
    )
    .default([]),
});

export default {
  path: '/survivors/',
  method: 'post',
  schema: survivorCreateSchema,
};
