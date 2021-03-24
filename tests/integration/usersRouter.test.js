/* eslint-disable no-undef */
const supertest = require('supertest');
const sequelize = require('../../src/utils/database');

const app = require('../../src/app');
const redis = require('../../src/utils/redis');
const utils = require('../utils');

const agent = supertest(app);

beforeAll(async () => {
  await utils.cleanDatabase();
});

afterAll(async () => {
  await utils.cleanDatabase();
  await utils.db.end();
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
    };

    const response = await agent.post('/users/sign-up').send(body);

    expect(response.status).toBe(422);
  });

  it('should return 409 if email already exists', async () => {
    await utils.createUser('gb1999@hotmail.com', 'dahoralek123', '12 992372036');
    const body = {
      name: 'gabriel',
      nickname: 'feipa',
      email: 'gb1999@hotmail.com',
      password: 'dahoralek123',
      passwordConfirmation: 'dahoralek123',
      ra: 18,
      phone: '12 992372037',
    };

    const response = await agent.post('/users/sign-up').send(body);
    expect(response.status).toBe(409);
  });

  it('should return 409 if number already exists', async () => {
    await utils.createUser('gb99@hotmail.com', 'dahoralek123', '12 992372035');
    const body = {
      name: 'gabriel',
      nickname: 'feipa',
      email: 'gbb1999@hotmail.com.br',
      password: 'dahoralek123',
      passwordConfirmation: 'dahoralek123',
      ra: 18,
      phone: '12 992372035',
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
      phone: '12 992372039',
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
    const newUser = await utils.createUser(email, password, '12 992372038');
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

describe('POST /users/sign-out', () => {
  it('should return 401 if missing authorization header', async () => {
    const response = await agent.post('/users/sign-out');

    expect(response.status).toBe(401);
  });

  it('should return 401 if missing token', async () => {
    const { status } = await agent.post('/users/sign-out').set('Authorization', 'Bearer ');

    expect(status).toBe(401);
  });

  it('should return 401 if token is invalid', async () => {
    const { status } = await agent.post('/users/sign-out').set('Authorization', 'Bearer asda1');

    expect(status).toBe(401);
  });

  it('should return 401 if token has expired', async () => {
    const { status } = await agent.post('/users/sign-out').set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiJ9.Nzk.QO9r16BVbpxBBzflkmwd5JP7KbOUNbS4O6ESKOtWn5Y');

    expect(status).toBe(401);
  });

  it('should return 204 and delete the session', async () => {
    const user = await utils.createUser('bg19@hotmail.com', '123456', '12 11111111');
    const token = await utils.createSession(user.id);
    const { status } = await agent.post('/users/sign-out').set('Authorization', `Bearer ${token}`);
    const session = await utils.redis.getSession(token);

    expect(status).toBe(204);
    expect(session).toBe(false);
  });
});
