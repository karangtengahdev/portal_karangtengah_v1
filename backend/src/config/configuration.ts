import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().required(),
  SUPABASE_URL: Joi.string().uri().required(),
  SUPABASE_SERVICE_ROLE_KEY: Joi.string().required(),
  SUPABASE_ANON_KEY: Joi.string().required(),
  STORAGE_BUCKET: Joi.string().default('public-content'),
  PORT: Joi.number().default(3000),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  BRIDGE_API_KEY: Joi.string().required(),
  WHATSAPP_API_URL: Joi.string().allow('').optional(),
  WHATSAPP_API_TOKEN: Joi.string().allow('').optional(),
});

export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  nodeEnv: process.env.NODE_ENV ?? 'development',
  supabase: {
    url: process.env.SUPABASE_URL,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    anonKey: process.env.SUPABASE_ANON_KEY,
    jwksUri: `${process.env.SUPABASE_URL}/auth/v1/.well-known/jwks.json`,
  },
  storage: {
    bucket: process.env.STORAGE_BUCKET ?? 'public-content',
  },
  bridge: {
    apiKey: process.env.BRIDGE_API_KEY,
  },
  whatsapp: {
    apiUrl: process.env.WHATSAPP_API_URL,
    apiToken: process.env.WHATSAPP_API_TOKEN,
  },
});
