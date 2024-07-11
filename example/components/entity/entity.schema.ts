import { validate } from "@base/lib/restServer/types";
import Joi from "joi";

const headerSchema = Joi.object({
  "x-user": Joi.number().min(0).required(),
}).unknown(true);

const querySchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  birth_year: Joi.number().integer().min(1900).max(2013).required(),
  roles: Joi.array().items(Joi.string()).required(),
});

const bodySchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  birth_year: Joi.number().integer().min(1900).max(2013).required(),
  roles: Joi.array().items(Joi.string()).required(),
});
export const validationSchema: validate = {
  headers: headerSchema,
  params: Joi.object({}),
  query: querySchema,
  body: bodySchema,
  type: "json",
  failureCode: 400,
  meta: {
    desc: "TEst validation schema",
    produces: ["application/json"],
    responseModel: {},
  },
};


