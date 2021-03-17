require('dotenv').config();
const { Pool } = require('pg');

const db = new Pool({ connectionString: process.env.DATABASE_URL });

module.exports = {
  db,

  cleanDatabase: async () => {
    await db.query('DELETE FROM users');
  },

  createUser: async (email) => {
    await db.query(`INSERT INTO users
    (name, nickname, email, password, ra, place) VALUES
    ('gabriel', 'feipa', '${email}', 'dahoralek123', 18, 'tajmahal')
    RETURNING *;`);
  },
};
