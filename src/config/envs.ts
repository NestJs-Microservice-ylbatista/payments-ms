/* eslint-disable prettier/prettier */
import'dotenv/config';
import * as joi from 'joi';

interface EnvVars {
    PORT: number;
    STRIPE_SECRET: string;

    STRIPE_SUCCESS_URL: string;
    STRIPE_CANCEL_URL: string;
    STRIPE_ENDPOINT_SECRET: string;
}

const envsSchema = joi.object({
    PORT: joi.number().required(),
    
    STRIPE_SECRET: joi.string().required(),

    STRIPE_SUCCESS_URL: joi.string().required(),
    STRIPE_CANCEL_URL: joi.string().required(),
    STRIPE_ENDPOINT_SECRET: joi.string().required(),
})
.unknown(true);

const { error, value } = envsSchema.validate( process.env );
if( error ) {
    throw new Error(`Config Validation error: \${ error.message }`);
}

const envVars: EnvVars = value;

export const envs = {
    port: envVars.PORT,
    stripeSecret: envVars.STRIPE_SECRET,

    stripeSuccess: envVars.STRIPE_SUCCESS_URL,
    stripeCancel: envVars.STRIPE_CANCEL_URL,
    stripeEndPointSecret: envVars.STRIPE_ENDPOINT_SECRET,
}