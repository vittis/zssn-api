import Joi from 'joi';

export interface SurvivorUpdateDTO {
  name?: string;
  gender?: string;
  age?: number;
  coordinates?: [number, number];
}

const survivorUpdateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(100),
  gender: Joi.string()
    .valid(['M', 'F'])
    .uppercase(),
  age: Joi.number()
    .integer()
    .positive(),
  coordinates: Joi.array().items(
    Joi.number()
      .greater(-181)
      .less(181),
  ),
});

export default {
  path: '/survivors/:id',
  method: 'patch',
  schema: survivorUpdateSchema,
};
