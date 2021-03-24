require('dotenv').config();
const { hashSync } = require('bcrypt');
const { Pool } = require('pg');

const redis = require('../src/utils/redis');

const db = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
  db,

  redis,

  cleanDatabase: async () => {
    await db.query('DELETE FROM users');
    await redis.resetRedisDB();
  },

  createUser: async (email, password, phone) => {
    const user = await db.query(`INSERT INTO users
    (name, nickname, email, password, ra, phone) VALUES
    ('gabriel', 'feipa', '${email}', '${hashSync(password, 10)}', 18, '${phone}')
    RETURNING *;`);

    return user.rows[0];
  },

  createSession: async (id) => redis.setSession(id),
};
