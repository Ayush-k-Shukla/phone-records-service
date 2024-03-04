import Joi from 'joi';

/**
 * User sign up validator
 */
export const signupValidator = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().optional(),
  password: Joi.string().required(),
  phone: Joi.string().required(),
});

/**
 * User login validator
 */
export const loginValidator = Joi.object({
  phone: Joi.string().required(),
  password: Joi.string().required(),
});

/**
 * Mark as spam validator
 */
export const markAsSpamValidator = Joi.object({
  phone: Joi.string().required(),
});
