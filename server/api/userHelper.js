const {User} = require('../db/models');

const find = async (req, res, next) => {
  const whereClause = req.query &&
    req.query.publicAddress && {
      where: { publicAddress: req.query.publicAddress }
    };
  try {
    const users = await User.findAll(whereClause);
    res.json(users)
  } catch (err) {
    next(err);
  }

};

const get = async (req, res, next) => {
  if (req.user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' });
  }
  try {
    const user = await User.findById(req.params.userId)
    res.json(user);
  } catch (err) {
    next(user);
  }
};

const create = async (req, res, next) => {
  console.log(req.body);
  try {
    const newUser = await User.create(req.body)
    res.json(newUser)
  } catch (err) {
    next(err);
  }
}

const patch = async (req, res, next) => {
  if (req.user.payload.id !== +req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' });
  }
  try {
    const user = await User.findById(req.params.userId);
    const updatedUser = await user.update({
      username: req.body.username,
    });
    res.json(updatedUser);
  } catch (err) {
    next(err);
  }

};

module.exports = {find, create, get, patch};
