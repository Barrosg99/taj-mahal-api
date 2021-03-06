/* eslint-disable no-unused-vars */
require('dotenv').config();
require('express-async-errors');

const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// require('./utils/loadRelationships');

// const { verifyJWT } = require('./middlewares');

const usersRouter = require('./routers/client/usersRouter');
const cardRouter = require('./routers/client/cardRouter');

const {
  InvalidDataError, ConflictError, AuthError, AlreadyHaveCardError, DoesNotHaveCardError,
} = require('./errors');

require('./utils/loadRelationships');

app.use('/users', usersRouter);
app.use('/card', cardRouter);

app.use((error, req, res, next) => {
  console.error(error);

  if (error instanceof InvalidDataError) res.status(422).send(error.message);
  else if (error instanceof ConflictError) res.status(409).send(error.message);
  else if (error instanceof AuthError) res.status(401).send(error.message);
  else if (error instanceof DoesNotHaveCardError) res.status(412).send(error.message);
  else if (error instanceof AlreadyHaveCardError) res.status(412).send(error.message);
  else res.status(500).json(error);
});

module.exports = app;
