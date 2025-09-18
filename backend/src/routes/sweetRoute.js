import express from 'express';
import Sweet from '../models/Sweet.js';
import { validateSweet, validateSweetSearch, validateSweetUpdate } from '../middlewares/validation.js';
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

// update a sweet by id
router.put('/:id', authenticateToken, authorizeRoles('admin'), validateSweetUpdate, async (req, res) => {
    try {
        const sweetId = req.params.id;
        const updateData = req.body;

        // find the sweet by id
        const sweet = await Sweet.findById(sweetId);
        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
        }

        // if name is being updated, check for uniqueness
        if (updateData.name && updateData.name !== sweet.name) {
            const existingSweet = await Sweet.findOne({ name: updateData.name });
            if (existingSweet) {
                return res.status(400).json({
                    success: false,
                    message: "Another sweet with this name already exists"
                });
            }
        }
        
        // update the sweet
        Object.assign(sweet, updateData);
        await sweet.save(); 

        // respond with the updated sweet
        res.status(200).json({
            success: true,
            message: "Sweet updated successfully",
            sweet
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while updating sweet",
            error: error.message
        })
    }
})

// delete a sweet by id
router.delete('/:id', authenticateToken, authorizeRoles('admin'), async (req, res) => {
    try {
        const sweetId = req.params.id;

        // find the sweet by id
        const sweet = await Sweet.findById(sweetId);
        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
        }

        // delete the sweet
        await Sweet.findByIdAndDelete(sweetId);
        
        // respond with success message
        res.status(200).json({
            success: true,
            message: "Sweet deleted successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error while deleting sweet",
            error: error.message
        })
    }
})

// purchase a sweet by id (decrease quantity)
router.post('/:id/purchase', authenticateToken, authorizeRoles('user'), async (req, res) => {
    try {
        const sweetId = req.params.id;
        const { quantity } = req.body;
        
        // find the sweet by id
        const sweet = await Sweet.findById(sweetId);
        if (!sweet) {
            return res.status(404).json({
                success: false,
                message: "Sweet not found"
            });
        }

        // check if enough quantity is available
        if (sweet.quantity < quantity) {
            return res.status(400).json({
                success: false,
                message: "Insufficient stock"
            });
        }

        // decrement the quantity
        sweet.quantity -= quantity;
        await sweet.save();

        // respond with success message
        res.status(200).json({
            success: true,
            message: "Purchase successful",
            sweet
        }); 
    } catch(error) {
        res.status(500).json({
            success: false,
            message: "Server error while purchasing sweet",
            error: error.message
        })
    }
})

export default router;