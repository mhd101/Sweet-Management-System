import express from 'express';
import Sweet from '../models/Sweet.js';
import { validateSweet } from '../middlewares/validation.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// add a new sweet
router.post('/', authenticateToken, authorizeRoles('user'), validateSweet, async (req, res) => {
    try {
        const  { name, category, price, quantity } = req.body;

        // check if sweet with the same name already exists
        const existingSweet = await Sweet.findOne({
            name: name
        })

        if (existingSweet) {
            return res.status(400).json({
                success: false,
                message: "Sweet with this name already exists"
            });
        }

        // create a new sweet
        const newSweet = new Sweet({
            name, 
            category,
            price,
            quantity
        });

        // save sweet to db
        await newSweet.save();  

        // respond with the new sweet
        res.status(201).json({
            success: true,
            message: "Sweet created successfully",
            sweet: newSweet
        });

    }catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while creating sweet",
            error: error.message
        })
    }
})

export default router;