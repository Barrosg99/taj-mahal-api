/* eslint-disable no-undef */
const usersController = require('../../src/controllers/usersController');
const User = require('../../src/models/User');

jest.mock('../../src/models/User');

describe('createUser', () => {
  it('should return the user without the password field', () => {
    User.create.mockResolvedValue({
      name: 'asdsadsa',
      email: 'asdasdas',
      password: 'asdasfsafa',
    });
    const user = usersController.createUser({});
    expect(user.password).toBe(undefined);
  });
});
