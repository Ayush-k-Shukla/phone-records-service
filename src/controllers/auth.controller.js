import User from '../models/user.model.js';
import {
  extractValidatorErrorMessages,
  generateToken,
} from '../utils/helper.js';
import { loginValidator, signupValidator } from '../utils/validator.js';

/**
 * Validate and create a new user
 * @param {*} req
 * @param {*} res
 * @returns if successful return access token else error
 */
export const signup = async (req, res) => {
  try {
    // Validate input
    const { error } = signupValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ errors: extractValidatorErrorMessages(error) });
    }

    const { name, email, password, phone } = req.body;

    // Check if user with the same number already exists
    const existingUser = await User.findOne({ where: { phone } });
    if (existingUser) {
      return res.status(400).json({ error: 'Phone number already exists' });
    }

    // Create user
    const user = await User.create({ name, email, password, phone });

    // Generate and send token
    const token = generateToken(user);
    res.json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Validate the user credentials and log them in if successful
 * @param {*} req
 * @param {*} res
 * @returns if sucessfull returns access token else error
 */
export const login = async (req, res) => {
  try {
    // Validate input
    const { error } = loginValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ errors: extractValidatorErrorMessages(error) });
    }

    const { phone, password } = req.body;

    // Find user by phone
    const user = await User.findOne({ where: { phone } });

    // Check if user exists and verify password
    if (user && (await user.validatePassword(password))) {
      const token = generateToken(user);
      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid phone or password' });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
