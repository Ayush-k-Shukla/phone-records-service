import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const Spam = sequelize.define('Spam', {
  phone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Spam;
