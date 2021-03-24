const router = require('express').Router();
const { hashSync, compareSync } = require('bcrypt');

const usersController = require('../../controllers/usersController');
const usersSchema = require('../../schemas/usersSchema');
const { InvalidDataError, ConflictError } = require('../../errors');
const AuthError = require('../../errors/AuthError');
const authMiddleware = require('../../middlewares/authMiddleware');

router
  .post('/sign-up', async (req, res) => {
    const { error } = usersSchema.signUp.validate(req.body);
    if (error) throw new InvalidDataError(error.details[0].message);

    if (await usersController.findUserByEmail(req.body.email)) throw new ConflictError('Email already in use');

    if (await usersController.findUserByPhone(req.body.phone)) throw new ConflictError('Number already registered');

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
  })
  .post('/sign-out', authMiddleware, async (req, res) => {
    await usersController.deleteSession(req.sessionId);
    res.sendStatus(204);
  })
  .post('/card', authMiddleware, async (req, res) => {
    const user = await usersController.userHasCard();
    if (user) {
      res.status(204).send(user);
    } else {
      await usersController.userTakeCard(req.userId);
      res.sendStatus(200);
    }
  })
  .post('/card-release', authMiddleware, async (req, res) => {
    await usersController.userReturnCard(req.userId);
    res.sendStatus(204);
  });

module.exports = router;
