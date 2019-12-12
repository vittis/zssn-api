import Joi from 'joi';

export interface SurvivorUpdateDTO {
  name?: string;
  gender?: string;
  age?: number;
  lon?: number;
  lat?: number;
}

const survivorUpdateSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(3)
    .max(100),
  gender: Joi.string()
    .valid(['M', 'F'])
    .uppercase(),
  age: Joi.number()
    .integer()
    .positive(),
  lon: Joi.number()
    .greater(-181)
    .less(181),
  lat: Joi.number()
    .greater(-91)
    .less(91),
});

export default {
  path: '/survivors/:id',
  method: 'patch',
  schema: survivorUpdateSchema,
};
