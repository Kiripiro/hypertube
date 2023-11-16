const { User, InvalidTokens } = require('../models');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid')

var nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

class UserController {
    register = async (req, res) => {
        try {
            const { username, firstName, lastName, email, password } = req.body;

            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ message: 'Email is already registered.' });
            }

            const hashedPassword = await bcrypt.hash(password, 10);
            const token = uuidv4();

            const newUser = await User.create({
                username,
                firstName,
                lastName,
                email,
                password: hashedPassword,
                token: token,
                tokenCreationDate: this._getTimestampString(),
                tokenExpirationDate: this._getTimestampString(1)
            });
            // mailOptions.to = userData.email;
            // mailOptions.subject = "Email verification";
            // mailOptions.text = "Hi " + userData.username + "\nClick on the following link to activate your account:\n" + process.env.FRONTEND_URL + "/verification/email/" + emailVerificationToken;
            // transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //         console.log('error = ' + error);
            //     } else {
            //         console.log('Email sent: ' + info.response);
            //     }
            // });

            res.cookie('accessToken', this._generateToken(newUser.id), { httpOnly: true, maxAge: 900000 });
            res.cookie('refreshToken', token, { httpOnly: true, maxAge: 86400000 });
            return res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    login = async (req, res) => {
        try {
            const { username, password } = req.body;

            const userExists = await User.findOne({ where: { username } });
            if (!userExists) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }

            const isPasswordValid = await bcrypt.compare(password, userExists.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid password' });
            }

            // if (userExists.emailVerified === false) {
            //     return res.status(401).json({ message: 'Email not verified' });
            // }

            const accessToken = this._generateToken(userExists.id);
            const refreshToken = uuidv4();
            if (userExists.passwordReset) {
                const dataToUpdate = {
                    passwordReset: false,
                    passwordResetToken: null,
                    token: refreshToken,
                    tokenCreationDate: this._getTimestampString(),
                    tokenExpirationDate: this._getTimestampString(1)
                };
                await User.update(dataToUpdate, { where: { username } });
            } else {
                const dataToUpdate = {
                    token: refreshToken,
                    tokenCreationDate: this._getTimestampString(),
                    tokenExpirationDate: this._getTimestampString(1)
                };
                await User.update(dataToUpdate, { where: { username } });
            }
            const user = {
                "id": userExists.id,
                "username": userExists.username,
                "firstName": userExists.firstName,
                "lastName": userExists.lastName,
                "avatar": userExists.avatar,
            };
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 900000 });
            res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 86400000 });
            return res.status(200).json({ message: 'User logged in successfully', user: user });
        } catch (error) {
            console.error('Error logging in user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    logout = async (req, res) => {
        try {
            const accessToken = this._parseCookie(req, 'accessToken');
            if (!accessToken) {
                return res.status(401).json({ message: 'Access token missing' });
            }
            const refreshToken = this._parseCookie(req, 'refreshToken');
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token missing' });
            }

            const invalidToken = await InvalidTokens.create({ accessToken, refreshToken });
            if (invalidToken) {
                res.clearCookie('accessToken');
                res.clearCookie('refreshToken');
                return res.status(200).json({ message: 'User logged out successfully' });
            } else {
                return res.status(401).json({ message: 'Invalid token' });
            }
        } catch (error) {
            console.error('Error logging out user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    refresh = async (req, res) => {
        try {
            const refreshToken = this._parseCookie(req, 'refreshToken');
            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token missing' });
            }
            if (!InvalidTokensController.findInvalidToken(null, refreshToken)) {
                return res.status(401).json({ message: 'Invalid token' });
            }
            const user = User.findOne({ where: { token: refreshToken } });
            if (!user) {
                return res.status(403).json({ message: 'Invalid token' });
            }
            const expiration = new Date(user.tokenExpirationDate);
            const now = new Date();
            if (now > expiration) {
                return res.status(401).json({ message: 'Token expired' });
            }
            const accessToken = this._generateToken(user.id);
            res.cookie('accessToken', accessToken, { httpOnly: true, maxAge: 900000 });
            res.status(200).json({ message: 'Token refreshed successfully' });
        } catch (error) {
            console.error('Error refreshing token:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    getUserById = async (req, res) => {
        try {
            const user = await User.findOne({ where: { id: req.body.id } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            } else {
                const userData = {
                    "id": user.id,
                    "username": user.username,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "avatar": user.avatar,
                };
                return res.status(200).json({ message: 'User found', user: userData });
            }
        } catch (error) {
            console.error('Error getting user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    getPersonalUser = async (req, res) => {
        try {
            const user = await User.findOne({ where: { id: req.user.userId } });
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            } else {
                const userData = {
                    "id": user.id,
                    "username": user.username,
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "avatar": user.avatar,
                };
                return res.status(200).json({ message: 'User found', user: userData });
            }
        } catch (error) {
            console.error('Error getting user:', error);
            return res.status(500).json({ message: 'Internal Server Error' });
        }
    };

    _generateToken(userId) {
        const secretKey = process.env.JWT_SECRET;
        const expiresInMinutes = Number(process.env.JWT_EXPIRES_IN);

        if (!secretKey || !expiresInMinutes) {
            throw new Error('JWT configuration error');
        }

        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimeInSeconds = currentTimeInSeconds + expiresInMinutes * 60;

        const payload = {
            userId: userId,
            iat: currentTimeInSeconds,
            exp: expirationTimeInSeconds
        };
        const token = jwt.sign(payload, secretKey);

        return token;
    }

    _getTimestampString(nextDays = 0) {
        const date = new Date();

        date.setDate(date.getDate() + nextDays);
        const time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
        const dateString = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " + time;

        return dateString;
    }

    _parseCookie(req, toFind) {
        const cookies = req.headers.cookie;
        if (cookies) {
            const cookieArray = cookies.split(';');
            for (let i = 0; i < cookieArray.length; i++) {
                const cookie = cookieArray[i].split('=');
                if (cookie[0].trim() === toFind) {
                    return cookie[1];
                }
            }
        }
        return null;
    }
}

module.exports = new UserController();