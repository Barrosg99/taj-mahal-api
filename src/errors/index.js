const AlreadyHaveCardError = require('./AlreadyHaveCardError');
const AuthError = require('./AuthError');
const ConflictError = require('./ConflictError');
const DoesNotHaveCardError = require('./DoesNotHaveCardError');
const InvalidDataError = require('./InvalidDataError');

module.exports = {
  ConflictError,
  InvalidDataError,
  AuthError,
  AlreadyHaveCardError,
  DoesNotHaveCardError,
};
