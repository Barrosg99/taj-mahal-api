require('dotenv').config();
const { hashSync } = require('bcrypt');
const { Pool } = require('pg');

const redis = require('../src/utils/redis');

const db = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
  db,

  cleanDatabase: async () => {
    await db.query('DELETE FROM users');
    await redis.resetRedisDB();
  },

  createUser: async (email, password) => {
    const user = await db.query(`INSERT INTO users
    (name, nickname, email, password, ra) VALUES
    ('gabriel', 'feipa', '${email}', '${hashSync(password, 10)}', 18)
    RETURNING *;`);

    return user.rows[0];
  },
};
