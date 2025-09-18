import { body, validationResult } from 'express-validator';

// handling validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation Failed",
            errors: errors.array()
        });
    }
    next();
}

// handling validation for registering a user
export const validateRegister = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long'),
    body('firstName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('First name is required'),
    body('lastName')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Last name is required'),
    handleValidationErrors
];

// handling validation for logging in a user
export const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),
  body('password')
    .exists()
    .withMessage('Password is required'),
  handleValidationErrors
];

// handling validation for creating a sweet
export const validateSweet = [
    body('name')
        .trim()
        .isLength({ min: 1 })
        .withMessage('Name is required'),
    body('category')
        .trim()
        .isIn(['cake', 'candy', 'cookie', 'pie', 'other'])
        .withMessage('Category must be one of the following: cake, candy, cookie, pie, other'),
    body('price')
        .isFloat({ gt: 0 })
        .withMessage('Price must be a number greater than 0'),
    body('quantity')
        .isInt({ gt: -1 })
        .withMessage('Quantity must be a non-negative integer'),
    handleValidationErrors
]

// validate search query parameters for sweets
export const validateSweetSearch = [
    body('search')
        .optional()
        .trim()
        .isLength({ min: 1 })
        .withMessage('Search term must be at least 1 character long'),
    body('category')
        .optional()
        .trim()
        .isIn(['cake', 'candy', 'cookie', 'pie', 'other'])
        .withMessage('Category must be one of the following: cake, candy, cookie, pie, other'),
    body('minPrice')
        .optional()
        .isFloat({ gt: -1 })
        .withMessage('Minimum price must be a number greater than or equal to 0'),
    body('maxPrice')
        .optional()
        .isFloat({ gt: -1 })
        .withMessage('Maximum price must be a number greater than or equal to 0'),
    body('minPrice').custom((value, { req }) => {
        if (value && req.body.maxPrice && parseFloat(value) > parseFloat(req.body.maxPrice)) {
            throw new Error('Minimum price cannot be greater than maximum price');
        }
        return true;
    }),
    handleValidationErrors
];
