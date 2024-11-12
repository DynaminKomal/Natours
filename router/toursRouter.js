const express = require('express');
const router = express.Router();
const toursController = require('../controllers/toursController');
const reviewRouter = require('./reviewRouter');
const { tokenVerify } = require('../utility/token-verify');

router.use('/:tourId/reviews', reviewRouter)

router.use(tokenVerify)

router.get('/tour-stats', toursController.getTourStats)
router.get('/monthly-plan', toursController.getMonthlyPlan)

router.get('/', toursController.getAllTours)
router.post('/', toursController.checkDataExists, toursController.createTour)
router.get('/:id', toursController.getTour)
router.put('/:id', toursController.updateTour)
router.delete('/:id', toursController.deleteTour)





module.exports = router;
