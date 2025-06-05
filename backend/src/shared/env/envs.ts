import { BadRequestException } from '@nestjs/common';
import 'dotenv/config';
import * as joi from 'joi';

interface IEnvs {
  PORT: string;
  SECRET_JWT: string;
  DATABASE_URL: string;
}

const envsSchema = joi
  .object<IEnvs>({
    PORT: joi.string().required(),
    SECRET_JWT: joi.string().required(),
    DATABASE_URL: joi.string().required(),
  })
  .unknown(true);

const { error, value } = envsSchema.validate(process.env);

if (error) {
  throw new BadRequestException(error.message);
}

const envVars: IEnvs = value;

export const envs = {
  PORT: envVars.PORT,
  DATABASE_URL: envVars.DATABASE_URL,
  SECRET_JWT: envVars.SECRET_JWT,
};
