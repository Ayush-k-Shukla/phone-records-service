import Contact from './src/models/contact.model.js';
import Spam from './src/models/spam.model.js';
import User from './src/models/user.model.js';

/**
 * This is for testing and not considering all test cases
 * also for testing of some edge cases i had manually added data for testing
 **/

const populateTestData = async () => {
  try {
    const user1 = await User.create({
      name: 'John Doe',
      phone: '1234567890',
      password: 'password1',
    });
    const user2 = await User.create({
      name: 'Jane Smith',
      phone: '9876543210',
      password: 'password2',
    });

    const contact1User1 = await Contact.create({
      name: 'Friend 1',
      phone: '1111111111',
      userId: user1.id,
    });
    const contact2User1 = await Contact.create({
      name: 'Friend 2',
      phone: '2222222222',
      userId: user1.id,
    });

    const contact1User2 = await Contact.create({
      name: 'Friend 3',
      phone: '3333333333',
      userId: user2.id,
    });
    const contact2User2 = await Contact.create({
      name: 'Friend 4',
      phone: '4444444444',
      userId: user2.id,
    });

    const spam1 = await Spam.create({
      phone: '5555555555',
      userId: user1.id,
    });
    const spam2 = await Spam.create({
      phone: '6666666666',
      userId: user2.id,
    });

    // Additional entries
    const additionalContacts = [
      { name: 'Friend 5', phone: '5555555555', userId: user1.id },
      { name: 'Friend 6', phone: '6666666666', userId: user1.id },
      { name: 'Friend 7', phone: '7777777777', userId: user2.id },
      { name: 'Friend 8', phone: '8888888888', userId: user2.id },
      { name: 'Friend 9', phone: '9999999999', userId: user1.id },
      { name: 'Friend 10', phone: '1010101010', userId: user2.id },
    ];

    const additionalSpams = [
      { phone: '1111111111', userId: user2.id },
      { phone: '2222222222', userId: user1.id },
      { phone: '3333333333', userId: user1.id },
      { phone: '4444444444', userId: user2.id },
    ];

    await Contact.bulkCreate(additionalContacts);

    await Spam.bulkCreate(additionalSpams);

    console.log('Sample data populated successfully.');
  } catch (error) {
    console.error('Error populating sample data:', error);
  }
};

// Run the script
populateTestData();
