const router = require('express').Router();
const { signUp, login} = require('../controller/user.controller');

router.post('/signUp',signUp);
router.post('/login',login)

module.exports = router;