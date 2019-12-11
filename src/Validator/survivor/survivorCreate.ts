import Joi from 'joi';

export interface SurvivorCreateDTO {
  name: string;
  gender: string;
  age: number;
  lon: number;
  lat: number;
  items: [{ id: string; quantity: number }];
}

const survivorCreateSchema = Joi.object({
  name: Joi.string()
    .alphanum()
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
  lon: Joi.number().required(),
  lat: Joi.number().required(),
});

export default {
  path: '/survivors',
  method: 'post',
  schema: survivorCreateSchema,
};
