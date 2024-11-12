const express = require('express');
const router = express.Router();
const tourRoute = require("./toursRouter")
const userRoute = require("./usersRouter")
const authRouter = require("./authRouter")
const reviewRouter = require("./reviewRouter")


router.use('/tours', tourRoute)
router.use('/users', userRoute)
router.use('/auth', authRouter)
router.use('/reviews', reviewRouter)



module.exports = router;