const express = require('express');
const router = express.Router();
const viewController = require('../controllers/viewController')

//all templates
router.get('/', viewController.getOverview)
router.get('/tour/:slug', viewController.getTour)
router.get('/login', viewController.login)

module.exports = router;