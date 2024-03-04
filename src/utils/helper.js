import jwt from 'jsonwebtoken';

/**
 * combines all errors messages together into an array
 * @param {*} errors
 * @returns array of error messages
 */
export const extractValidatorErrorMessages = (errors) => {
  return errors.details.map((detail) => detail.message);
};

/**
 * Calculates spam likelihood based on spam entries
 * sums the spam entries count present for user number
 *
 * @param {*} user
 * @param {*} spamEntries
 * @returns number
 */
export const calculateSpamLikelihood = (user, spamEntries) => {
  return spamEntries.reduce((acc, entry) => {
    if (user.phone === entry.phone) {
      return acc + 1;
    }

    return acc;
  }, 0);
};

/**
 * Generates JWT token
 * @param {*} user
 * @returns
 */
export const generateToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
    expiresIn: '1h', // expires in 1 hour
  });
};
