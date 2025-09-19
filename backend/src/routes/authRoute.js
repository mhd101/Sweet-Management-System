import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRegister, validateLogin } from '../middlewares/validation.js';

const router = express.Router();

// generate jwt token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
}

// register a new user
router.post('/register', validateRegister, async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // check if user already exists
        const existingUser = await User.findOne({
            email
        })

        // check if user already exsists
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists"
            });
        }

        // create new user
        const newUser = new User({
            firstName,
            lastName,
            email,
            password,
            role: 'user' // default role is user
        });

        // save user to db
        await newUser.save();

        // generate token
        const token = generateToken(newUser);

        // respond with token and user info
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            token,
            user: {
                id: newUser._id,
                firstName: newUser.firstName,
                lastName: newUser.lastName,
                email: newUser.email,
                role: newUser.role
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
});

// login an existing user
router.post('/login', validateLogin, async (req, res) => {
    try {
        const { email, password } = req.body;

        // find user by email
        const user = await User.findOne({
            email
        })

        // if user not found
        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            })
        }

        // check if password not matches
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid Email or Password"
            });
        }

        // generate token
        const token = generateToken(user);

        // respond with token and user info
        res.status(200).json({
            success: true,
            message: "User logged in successfully",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: error.message
        });
    }

})

export default router;



