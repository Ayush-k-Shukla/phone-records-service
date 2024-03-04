import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';
import sequelize from '../db/connection.js';

const User = sequelize.define('User', {
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: true },
  phone: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
});

// Hash password before creating
User.beforeCreate(async (user) => {
  const salt = 10;
  user.password = await bcrypt.hash(user.password, salt);
});

// validate password
User.prototype.validatePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

export default User;
