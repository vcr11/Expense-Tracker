const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

// Input sanitization
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return sanitizeHtml(input, {
            allowedTags: [],
            allowedAttributes: {}
        }).trim();
    }
    return input;
};

// Validation schemas
const transactionSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Title cannot be empty',
            'string.max': 'Title cannot exceed 100 characters',
            'any.required': 'Title is required'
        }),

    amount: Joi.number()
        .positive()
        .precision(2)
        .max(999999.99)
        .required()
        .messages({
            'number.base': 'Amount must be a number',
            'number.positive': 'Amount must be positive',
            'number.max': 'Amount cannot exceed $999,999.99',
            'any.required': 'Amount is required'
        }),

    category: Joi.string()
        .valid('salary', 'freelancing', 'investments', 'stocks', 'bitcoin', 'bank', 'youtube', 'other',
               'education', 'groceries', 'health', 'subscriptions', 'takeaways', 'clothing', 'travelling')
        .required()
        .messages({
            'any.only': 'Invalid category selected',
            'any.required': 'Category is required'
        }),

    description: Joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
            'string.empty': 'Description cannot be empty',
            'string.max': 'Description cannot exceed 200 characters',
            'any.required': 'Description is required'
        }),

    date: Joi.date()
        .iso()
        .required()
        .messages({
            'date.base': 'Invalid date format',
            'date.format': 'Date must be in ISO format',
            'any.required': 'Date is required'
        })
});

// Auto-categorize validation
const autoCategorizeSchema = Joi.object({
    title: Joi.string()
        .min(1)
        .max(100)
        .required()
        .messages({
            'string.empty': 'Title cannot be empty',
            'any.required': 'Title is required'
        }),

    description: Joi.string()
        .min(1)
        .max(200)
        .required()
        .messages({
            'string.empty': 'Description cannot be empty',
            'any.required': 'Description is required'
        })
});

// Middleware to validate request body
const validateTransaction = (req, res, next) => {
    // Sanitize inputs
    if (req.body.title) req.body.title = sanitizeInput(req.body.title);
    if (req.body.description) req.body.description = sanitizeInput(req.body.description);
    if (req.body.category) req.body.category = sanitizeInput(req.body.category);

    const { error, value } = transactionSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    req.body = value;
    next();
};

const validateAutoCategorize = (req, res, next) => {
    // Sanitize inputs
    if (req.body.title) req.body.title = sanitizeInput(req.body.title);
    if (req.body.description) req.body.description = sanitizeInput(req.body.description);

    const { error, value } = autoCategorizeSchema.validate(req.body, { abortEarly: false });

    if (error) {
        const errors = error.details.map(detail => ({
            field: detail.path[0],
            message: detail.message
        }));

        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors
        });
    }

    req.body = value;
    next();
};

module.exports = {
    validateTransaction,
    validateAutoCategorize
};
