
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const auth = require('../middleware/auth.middleware');
const Role = require('../utils/userRoles.utils');
const awaitHandlerFactory = require('../middleware/awaitHandlerFactory.middleware');

const { 
	createUserSchema,
	updateUserSchema,
	validateLogin,
	tokenSchema,
	forgotPasswordSchema,
	resetPasswordSchema
	 } = require('../middleware/validators/userValidator.middleware');


router.get('/', auth(), awaitHandlerFactory(userController.getAllUsers)); // localhost:3000/api/v1/users
router.get('/id/:id', auth(), awaitHandlerFactory(userController.getUserById)); // localhost:3000/api/v1/users/id/1
router.get('/username/:username', auth(), awaitHandlerFactory(userController.getUserByuserName)); // localhost:3000/api/v1/users/usersname/julia
router.get('/whoami', auth(), awaitHandlerFactory(userController.getCurrentUser)); // localhost:3000/api/v1/users/whoami
router.post('/', createUserSchema, awaitHandlerFactory(userController.createUser)); // localhost:3000/api/v1/users
router.post('/forgot/password', forgotPasswordSchema, awaitHandlerFactory(userController.forgotPassword)); // localhost:3000/api/v1/users/forgot/password
router.post('/reset/password/:token', resetPasswordSchema, awaitHandlerFactory(userController.resetPassword)); // localhost:3000/api/v1/users/reset/password/:token
router.post('/confirm/:token',tokenSchema, awaitHandlerFactory(userController.confirmAccount)); // localhost:3000/api/v1/users/confirm/:token
router.patch('/account_id/:account_id', auth(Role.User), updateUserSchema, awaitHandlerFactory(userController.updateUser)); // localhost:3000/api/v1/users/account_id/1 , using patch for partial update
router.delete('/id/:id', auth(Role.Admin), awaitHandlerFactory(userController.deleteUser)); // localhost:3000/api/v1/users/id/1


router.post('/login', validateLogin, awaitHandlerFactory(userController.userLogin)); // localhost:3000/api/v1/users/login

module.exports = router;