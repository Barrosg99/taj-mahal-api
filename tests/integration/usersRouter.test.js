/* eslint-disable no-undef */
const supertest = require('supertest');
const sequelize = require('../../src/utils/database');

const app = require('../../src/app');
const { cleanDatabase, db, createUser } = require('../utils');

const agent = supertest(app);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await db.end();
  await sequelize.close();
});

describe('POST /users/sign-up', () => {
  it('should return 422 if data is invalid', async () => {
    const body = {
      // name: 'gabriel',
      nickname: 'feipa',
      email: 'gb1999@hotmail.co',
      password: 'dahoralek123',
      passwordConfirmation: 'dahoralek123',
      ra: 18,
      place: 'tajmahal',
    };

    const response = await agent.post('/users/sign-up').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 409 if email already exists', async () => {
    await createUser('gb1999@hotmail.com');
    const body = {
      name: 'gabriel',
      nickname: 'feipa',
      email: 'gb1999@hotmail.com',
      password: 'dahoralek123',
      passwordConfirmation: 'dahoralek123',
      ra: 18,
      place: 'tajmahal',
    };

    const response = await agent.post('/users/sign-up').send(body);
    expect(response.status).toBe(409);
  });

  it('should return 201 and the user object', async () => {
    const user = {
      name: 'gabriel',
      nickname: 'feipa',
      email: 'gb1999@hotmail.co',
      password: 'dahoralek123',
      passwordConfirmation: 'dahoralek123',
      ra: 18,
      place: 'tajmahal',
    };

    const { status, body } = await agent.post('/users/sign-up').send(user);

    delete user.password;
    delete user.passwordConfirmation;

    expect(status).toBe(201);
    expect(body).toMatchObject(user);
  });
});
