const router = require('express').Router();

const usersController = require('../../controllers/usersController');
const usersSchema = require('../../schemas/usersSchema');
const { InvalidDataError, ConflictError } = require('../../errors');

router
  .post('/sign-up', async (req, res) => {
    const { error } = usersSchema.signUp.validate(req.body);
    if (error) throw new InvalidDataError(error.details[0].message);

    if (await usersController.findUserByEmail(req.body.email)) throw new ConflictError('Email already in use');

    res.status(201).send(await usersController.createUser(req.body));
  })
  .post('/sign-in', async (req, res) => {

  });

module.exports = router;
