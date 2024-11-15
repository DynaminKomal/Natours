const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { tokenVerify } = require('../utility/token-verify');

//all templates
router.get('/', viewController.getOverview)
router.get('/login', viewController.login)
router.use(tokenVerify)
router.get('/tour/:slug', viewController.getTour)

module.exports = router;