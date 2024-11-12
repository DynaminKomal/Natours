const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { tokenVerify } = require('../utility/token-verify');

router.use(tokenVerify)

router.get('/', userController.getAllUsers)
router.put('/change-password', userController.updatePassword)
router.patch('/update-profile', userController.updateProfile)
router.delete('/:id', userController.deleteUser)



module.exports = router;