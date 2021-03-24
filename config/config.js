const dotenv = require('dotenv');

dotenv.config();

module.exports = {
  development: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      useUTC: false, // for reading from database
    },
    timezone: '-03:00', // for writing to database
  },
  test: {
    url: process.env.DATABASE_URL,
  },
  production: {
    url: process.env.DATABASE_URL,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: false,
        rejectUnauthorized: false,
      },
      useUTC: false, // for reading from database
    },
    timezone: '-03:00', // for writing to database
  },
};
