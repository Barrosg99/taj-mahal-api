/* eslint-disable no-undef */
const supertest = require('supertest');
const sequelize = require('../../src/utils/database');

const app = require('../../src/app');
const redis = require('../../src/utils/redis');
const { cleanDatabase, db, createUser } = require('../utils');

const agent = supertest(app);

beforeAll(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await cleanDatabase();
  await db.end();
  await sequelize.close();
  await redis.close();
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
    await createUser('gb1999@hotmail.com', 'dahoralek123');
    const body = {
      name: 'gabriel',
      nickname: 'feipa',
      email: 'gb1999@hotmail.com',
      password: 'dahoralek123',
      passwordConfirmation: 'dahoralek123',
      ra: 18,
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
    };

    const { status, body } = await agent.post('/users/sign-up').send(user);

    delete user.password;
    delete user.passwordConfirmation;

    expect(status).toBe(201);
    expect(body).toMatchObject(user);
  });
});

describe('POST /users/sign-in', () => {
  const email = 'gb1999@hotmail.com.br';
  const password = 'dahoralek123';

  it('should return 422 if data is invalid', async () => {
    const body = {
      email,
    };
    const { status } = await agent.post('/users/sign-in').send(body);
    expect(status).toBe(422);
  });

  it('should return 401 if email or password are wrong', async () => {
    const body = {
      email: 'gasd@hotmail.com',
      password,
    };
    const { status } = await agent.post('/users/sign-in').send(body);
    expect(status).toBe(401);
  });

  it('should return 201 and the token created', async () => {
    const newUser = await createUser(email, password);
    delete newUser.password;
    delete newUser.createdAt;
    delete newUser.updatedAt;

    const user = {
      email,
      password,
    };
    const { status, body } = await agent.post('/users/sign-in').send(user);
    expect(status).toBe(201);
    expect(body).toEqual(expect.objectContaining({ ...newUser, token: expect.any(String) }));
  });
});
