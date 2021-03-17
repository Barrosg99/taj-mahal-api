const router = require('express').Router();
const { hashSync, compareSync } = require('bcrypt');

const usersController = require('../../controllers/usersController');
const usersSchema = require('../../schemas/usersSchema');
const { InvalidDataError, ConflictError } = require('../../errors');
const AuthError = require('../../errors/AuthError');

router
  .post('/sign-up', async (req, res) => {
    const { error } = usersSchema.signUp.validate(req.body);
    if (error) throw new InvalidDataError(error.details[0].message);

    if (await usersController.findUserByEmail(req.body.email)) throw new ConflictError('Email already in use');

    req.body.password = hashSync(req.body.password, 10);

    res.status(201).send(await usersController.createUser(req.body));
  })
  .post('/sign-in', async (req, res) => {
    const { error } = usersSchema.signIn.validate(req.body);
    if (error) throw new InvalidDataError(error.details[0].message);

    const user = await usersController.findUserByEmail(req.body.email);

    if (!user || !compareSync(req.body.password, user.password)) throw new AuthError('Email or password incorrect');

    delete user.dataValues.password;
    delete user.dataValues.createdAt;
    delete user.dataValues.updatedAt;
    user.dataValues.token = await usersController.createSession(user.id);

    res.status(201).send(user);
  });

module.exports = router;
