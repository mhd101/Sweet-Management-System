import express from 'express';
import Sweet from '../models/Sweet.js';
import { validateSweet, validateSweetSearch } from '../middlewares/validation.js';
import { authenticateToken, authorizeRoles } from '../middlewares/auth.js';

const router = express.Router();

// add a new sweet
router.post('/', authenticateToken, validateSweet, async (req, res) => {
    try {
        const { name, category, price, quantity } = req.body;

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

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while creating sweet",
            error: error.message
        })
    }
})

// get all sweets
router.get('/', authenticateToken, async (req, res) => {
    try {
        const sweets = await Sweet.find();

        // check if sweets exist
        if (!sweets || sweets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No sweets found"
            });
        }

        // respond with the sweets
        res.status(200).json({
            success: true,
            message: "Sweets fetched successfully",
            sweets
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while fetching sweets",
            error: error.message
        })
    }
})

// search sweets by name, category or price range
router.get('/search', authenticateToken, validateSweetSearch, async (req, res) => {
    try {
        const { name, category, minPrice, maxPrice } = req.query;
        // store filters in an object
        let filter = {}; 

        if (name) {
            filter.name = { $regex: name, $options: 'i' }; 
        }
        if (category) {
            filter.category = category;
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = parseFloat(minPrice);
            if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
        }

        const sweets = await Sweet.find(filter); // dynamic query based on filters

        // check if sweets exist
        if (!sweets || sweets.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No sweets found matching the criteria"
            });
        }

        // respond with the sweets
        res.status(200).json({
            success: true,
            message: "Sweets fetched successfully",
            sweets
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while searching sweets",
            error: error.message
        })
    }
})

export default router;