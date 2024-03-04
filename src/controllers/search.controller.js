import { Sequelize } from 'sequelize';
import Contact from '../models/contact.model.js';
import Spam from '../models/spam.model.js';
import User from '../models/user.model.js';
import { calculateSpamLikelihood } from '../utils/helper.js';

/**
 * Search by name in global database
 * @param {*} req
 * @param {*} res
 */
export const searchByName = async (req, res) => {
  try {
    const { name } = req.query;

    // Search for registered users with names starting or containing the search query
    const registeredUsers = await User.findAll({
      where: {
        name: {
          [Sequelize.Op.or]: [
            { [Sequelize.Op.startsWith]: name },
            { [Sequelize.Op.substring]: name },
          ],
        },
      },
    });

    // Search for contacts with names starting or containing the search query
    const userContacts = await Contact.findAll({
      where: {
        name: {
          [Sequelize.Op.or]: [
            { [Sequelize.Op.startsWith]: name },
            { [Sequelize.Op.substring]: name },
          ],
        },
      },
    });

    // Combine registered users and user contacts
    const allUsers = [...registeredUsers, ...userContacts];

    // Sorts the users based on whether their names start with a given string, then alphabetically.
    const orderedResults = allUsers.sort((a, b) => {
      const aStartsWith = a.name.startsWith(name) ? 0 : 1;
      const bStartsWith = b.name.startsWith(name) ? 0 : 1;

      return aStartsWith - bStartsWith || a.name.localeCompare(b.name);
    });

    // Search for spam entries for all users phone number
    const spamEntries = await Spam.findAll({
      where: {
        phone: {
          [Sequelize.Op.in]: orderedResults.map((user) => user.phone),
        },
      },
    });

    // Combine user and spam data to construct the final search results
    const searchResults = orderedResults.map((user) => ({
      name: user.name,
      phone: user.phone,
      spamLikelihood: calculateSpamLikelihood(user, spamEntries),
    }));

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 *  Search by phone in global database
 * @param {*} req
 * @param {*} res
 */
export const searchByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    // Search for registered users with the specified phone number
    const registeredUsers = await User.findAll({
      where: { phone },
    });

    // Search for spam entries with the specified phone number
    const spamEntries = await Spam.findAll({
      where: { phone },
    });

    // If a user registered with the specified phone number then only return that
    if (registeredUsers.length > 0) {
      const searchResults = registeredUsers.map((user) => ({
        name: user.name,
        phone: user.phone,
        spamLikelihood: calculateSpamLikelihood(user, spamEntries),
      }));

      return res.json(searchResults);
    }

    // Search for contacts of the user with the specified phone number
    const userContacts = await Contact.findAll({
      where: {
        phone,
      },
    });

    // Combine registered users and user contacts
    const allUsers = [...registeredUsers, ...userContacts];

    // Combine user and spam data to construct the final search results
    const searchResults = allUsers.map((user) => ({
      name: user.name,
      phone: user.phone,
      spamLikelihood: calculateSpamLikelihood(user, spamEntries),
    }));

    res.json(searchResults);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Get all details of user registered with given phone number
 * @param {*} req
 * @param {*} res
 */
export const getDetailsByPhone = async (req, res) => {
  try {
    const { phone } = req.params;

    const userId = req.user.id;

    // Search for registered user with the specified phone number
    const registeredUser = await User.findOne({
      where: { phone },
    });

    // Search for spam entries with the specified phone number
    const spamEntries = await Spam.findAll({
      where: { phone },
    });

    // Check if user contact exists with specified phone number
    const isUserContact = await Contact.findAll({
      where: {
        phone,
        userId,
      },
    });

    // If a user exist with specified phone number then only return that
    if (registeredUser) {
      const searchResult = {
        name: registeredUser.name,
        phone: registeredUser.phone,
        email: isUserContact.length > 0 ? registeredUser?.email : null, // if user contact then only show email
        spamLikelihood: calculateSpamLikelihood(registeredUser, spamEntries),
      };

      return res.json(searchResult);
    }

    const contactsWithSameNumber = await Contact.findAll({
      where: {
        phone,
      },
    });

    if (contactsWithSameNumber.length > 0) {
      const searchResult = {
        name: contactsWithSameNumber[0].name,
        phone: contactsWithSameNumber[0].phone,
        email: null,
        spamLikelihood: calculateSpamLikelihood(
          contactsWithSameNumber[0],
          spamEntries
        ),
      };

      return res.json(searchResult);
    }

    return res.status(404).json({ error: 'Phone number not found in record' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
