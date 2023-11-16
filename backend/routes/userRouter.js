const express = require('express');
const UserController = require('../controllers/userController');
const { validateUserRegistration, validateUserLogin } = require('../middlewares/userMiddleware');
const auth = require('../middlewares/auth');

const userRouter = express.Router();
userRouter.post('/register', validateUserRegistration, async (req, res) => {
    try {
        await UserController.register(req, res);
    } catch (error) {
        console.error(error);
    }
});

userRouter.post('/login', validateUserLogin, async (req, res) => {
    try {
        await UserController.login(req, res);
    } catch (error) {
        console.error(error);
    }
});

userRouter.post('/logout', auth, async (req, res) => {
    try {
        await UserController.logout(req, res);
    } catch (error) {
        console.error(error);
    }
});

userRouter.post('/refresh', async (req, res) => {
    try {
        await UserController.refresh(req, res);
    } catch (error) {
        console.error(error);
    }
});

userRouter.post('/id', auth, async (req, res) => {
    try {
        await UserController.getUserById(req, res);
    } catch (error) {
        console.error(error);
    }
});

userRouter.get('/id', auth, async (req, res) => {
    try {
        await UserController.getPersonalUser(req, res);
    } catch (error) {
        console.error(error);
    }
});

module.exports = userRouter;