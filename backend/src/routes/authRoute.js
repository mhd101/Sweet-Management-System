import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { validateRegister } from '../middlewares/validation.js';

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
            password
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
                email: newUser.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during registration',
            error: error.message
        });
    }
})

export default router;



