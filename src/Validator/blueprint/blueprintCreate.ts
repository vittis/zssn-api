import Joi from 'joi';

export interface BlueprintCreateDTO {
  name: string;
  points: string;
}

const blueprintCreateSchema = Joi.object({
  name: Joi.string()
    .min(3)
    .max(30)
    .required(),
  points: Joi.number()
    .integer()
    .positive()
    .required(),
});

export default {
  path: '/blueprints/',
  method: 'post',
  schema: blueprintCreateSchema,
};
