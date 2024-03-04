import Spam from '../models/spam.model.js';
import User from '../models/user.model.js';
import { extractValidatorErrorMessages } from '../utils/helper.js';
import { markAsSpamValidator } from '../utils/validator.js';

/**
 * mark given number as spam
 * @param {*} req
 * @param {*} res
 * @returns newly created spam entry
 */
export const markAsSpam = async (req, res) => {
  try {
    // Validate input
    const { error } = markAsSpamValidator.validate(req.body, {
      abortEarly: false,
    });
    if (error) {
      return res
        .status(400)
        .json({ errors: extractValidatorErrorMessages(error) });
    }

    const { phone } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the number is already marked as spam by the user
    const existingSpamEntry = await Spam.findOne({
      where: { phone, userId },
    });

    if (existingSpamEntry) {
      return res
        .status(400)
        .json({ error: 'Number already marked as spam by the user' });
    }

    // Create a new spam entry
    const spamEntry = await Spam.create({ phone, userId });

    res.status(201).json(spamEntry);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
