const router = require('express').Router();
const create = require('./authHelp');
module.exports = router;

/** POST /auth/web3 */
router.post('/', create);

