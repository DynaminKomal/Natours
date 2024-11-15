const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController');
const { isLoggedIn } = require('../utility/token-verify');

router.use(isLoggedIn)

router.get('/login', viewController.login)
router.get('/', viewController.getOverview)

router.get('/tour/:slug', viewController.getTour)

module.exports = router;