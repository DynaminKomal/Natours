const express = require('express')
const reviewController = require('../controllers/reviewController');
const { tokenVerify } = require('../utility/token-verify');

const router = express.Router({ mergeParams: true });


router.use(tokenVerify)

router.get('/', reviewController.getAllReview)
router.post('/', reviewController.createReview)
router.put('/:id', reviewController.updateReview)
router.delete('/:id', reviewController.deleteReview)

module.exports = router;