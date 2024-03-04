import dotenv from 'dotenv';
dotenv.config();

import bodyParser from 'body-parser';
import express from 'express';
import sequelize from './src/db/connection.js';
import routes from './src/routes/index.js';

const app = express();
app.use(bodyParser.json());

// routes registration
app.use('/', routes);

const PORT = process.env.PORT || 4000;

// DB setup
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error syncing database:', error);
  });
