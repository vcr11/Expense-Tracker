const { addExpense, getExpense, deleteExpense, autoCategorizeExpense, getBudgetSuggestions, askAI, getFinancialHealth } = require('../controllers/expense');
const { addIncome, getIncomes, deleteIncome } = require('../controllers/income');
const { validateTransaction, validateAutoCategorize } = require('../middleware/validation');
const { strictLimiter } = require('../middleware/security');

const router = require('express').Router();

// Income routes
router.post('/add-income', validateTransaction, addIncome);
router.get('/get-incomes', getIncomes);
router.delete('/delete-income/:id', deleteIncome);

// Expense routes
router.post('/add-expense', validateTransaction, addExpense);
router.get('/get-expenses', getExpense);
router.delete('/delete-expense/:id', deleteExpense);

// AI features (stricter rate limiting)
router.post('/auto-categorize-expense', strictLimiter, validateAutoCategorize, autoCategorizeExpense);
router.post('/ask-ai', strictLimiter, askAI);

// Analytics
router.get('/get-budget-suggestions', getBudgetSuggestions);
router.get('/financial-health', getFinancialHealth);

module.exports = router;
