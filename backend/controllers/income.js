const IncomeModel = require("../models/IncomeModel");
const { asyncHandler, logger } = require('../middleware/errorHandler');

/**
 * @desc    Add a new income
 * @route   POST /api/v1/add-income
 * @access  Public
 */
exports.addIncome = asyncHandler(async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    logger.info(`Adding income: ${title} - $${amount}`);

    const income = await IncomeModel.create({
        title,
        amount: parseFloat(amount),
        category,
        description,
        date
    });

    logger.info(`Income added successfully: ${income.id}`);

    res.status(201).json({
        success: true,
        message: 'Income added successfully',
        data: income
    });
});

/**
 * @desc    Get all incomes
 * @route   GET /api/v1/get-incomes
 * @access  Public
 */
exports.getIncomes = asyncHandler(async (req, res) => {
    const incomes = await IncomeModel.findAll();

    logger.info(`Retrieved ${incomes.length} incomes`);

    res.status(200).json({
        success: true,
        count: incomes.length,
        data: incomes
    });
});

/**
 * @desc    Delete an income
 * @route   DELETE /api/v1/delete-income/:id
 * @access  Public
 */
exports.deleteIncome = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'Valid income ID is required'
        });
    }

    const deleted = await IncomeModel.findByIdAndDelete(parseInt(id));

    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: 'Income not found'
        });
    }

    logger.info(`Income deleted: ${id}`);

    res.status(200).json({
        success: true,
        message: 'Income deleted successfully'
    });
});
