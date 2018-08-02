const router = require('express').Router();
const {find, get, create, patch} = require('./userHelper');
const config = require('./config');
const jwt = require('express-jwt');
module.exports = router;

/** GET /api/users */
router.route('/').get(find);

/** GET /api/users/:userId */
/** Authenticated route */
router.get('/:userId', jwt({ secret: config.secret }), get);

/** POST /api/users */
router.post('/', create);

/** PATCH /api/users/:userId */
/** Authenticated route */
router.patch('/:userId', jwt({ secret: config.secret }), patch);

module.exports = router;
