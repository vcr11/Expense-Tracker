const ExpenseModel = require("../models/ExpenseModel");
const OpenAI = require('openai');
const { asyncHandler, logger } = require('../middleware/errorHandler');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const categories = ['education', 'groceries', 'health', 'subscriptions', 'takeaways', 'clothing', 'travelling', 'other'];

/**
 * Categorize expense using OpenAI GPT
 * @param {string} title - Expense title
 * @param {string} description - Expense description
 * @returns {string} - Predicted category
 */
const categorizeExpense = async (title, description) => {
    try {
        const prompt = `Categorize the following expense into one of these categories: ${categories.join(', ')}.
        Expense title: "${title}".
        Description: "${description}".
        Respond with only the category name in lowercase.`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 10,
            temperature: 0.1
        });

        const category = response.choices[0].message.content.trim().toLowerCase();
        return categories.includes(category) ? category : 'other';
    } catch (error) {
        logger.error('AI categorization error:', error);
        return 'other';
    }
};

/**
 * @desc    Add a new expense
 * @route   POST /api/v1/add-expense
 * @access  Public
 */
exports.addExpense = asyncHandler(async (req, res) => {
    const { title, amount, category, description, date } = req.body;

    logger.info(`Adding expense: ${title} - $${amount}`);

    const expense = await ExpenseModel.create({
        title,
        amount: parseFloat(amount),
        category,
        description,
        date
    });

    logger.info(`Expense added successfully: ${expense.id}`);

    res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: expense
    });
});

/**
 * @desc    Get all expenses
 * @route   GET /api/v1/get-expenses
 * @access  Public
 */
exports.getExpense = asyncHandler(async (req, res) => {
    const expenses = await ExpenseModel.findAll();

    logger.info(`Retrieved ${expenses.length} expenses`);

    res.status(200).json({
        success: true,
        count: expenses.length,
        data: expenses
    });
});

/**
 * @desc    Delete an expense
 * @route   DELETE /api/v1/delete-expense/:id
 * @access  Public
 */
exports.deleteExpense = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: 'Valid expense ID is required'
        });
    }

    const deleted = await ExpenseModel.findByIdAndDelete(parseInt(id));

    if (!deleted) {
        return res.status(404).json({
            success: false,
            message: 'Expense not found'
        });
    }

    logger.info(`Expense deleted: ${id}`);

    res.status(200).json({
        success: true,
        message: 'Expense deleted successfully'
    });
});

/**
 * @desc    Auto-categorize expense using AI
 * @route   POST /api/v1/auto-categorize-expense
 * @access  Public
 */
exports.autoCategorizeExpense = asyncHandler(async (req, res) => {
    const { title, description } = req.body;

    logger.info(`AI categorizing expense: ${title}`);

    const category = await categorizeExpense(title, description);

    logger.info(`AI categorized as: ${category}`);

    res.status(200).json({
        success: true,
        category,
        confidence: 'high' // Could be improved with actual confidence scoring
    });
});

/**
 * @desc    Get budget suggestions based on historical data
 * @route   GET /api/v1/get-budget-suggestions
 * @access  Public
 */
exports.getBudgetSuggestions = asyncHandler(async (req, res) => {
    try {
        const expenses = await ExpenseModel.findAll();

        if (!expenses || expenses.length === 0) {
            return res.status(200).json({
                success: true,
                message: 'No expenses found to generate suggestions',
                data: []
            });
        }

        const categoryTotals = {};
        expenses.forEach(expense => {
            if (!categoryTotals[expense.category]) {
                categoryTotals[expense.category] = 0;
            }
            categoryTotals[expense.category] += expense.amount;
        });

        const suggestions = Object.keys(categoryTotals).map(category => {
            const totalSpent = categoryTotals[category];
            const averageMonthly = totalSpent / 12;
            const suggestedBudget = averageMonthly * 1.1; // 10% buffer

            return {
                category,
                totalSpent: parseFloat(totalSpent.toFixed(2)),
                averageMonthly: parseFloat(averageMonthly.toFixed(2)),
                suggestedBudget: parseFloat(suggestedBudget.toFixed(2)),
                suggestion: `Consider budgeting around $${suggestedBudget.toFixed(2)} per month for ${category} to cover expenses with a 10% buffer.`,
                period: 'monthly'
            };
        });

        logger.info(`Generated ${suggestions.length} budget suggestions`);

        res.status(200).json({
            success: true,
            count: suggestions.length,
            data: suggestions
        });
    } catch (error) {
        logger.error('Error generating budget suggestions:', error);
        // Return empty suggestions if there's an error (e.g., table doesn't exist)
        res.status(200).json({
            success: true,
            message: 'Unable to generate suggestions at this time',
            data: []
        });
    }
});

/**
 * @desc    AI-powered financial assistant for natural language queries
 * @route   POST /api/v1/ask-ai
 * @access  Public
 */
exports.askAI = asyncHandler(async (req, res) => {
    const { query } = req.body;

    if (!query || query.trim().length === 0) {
        return res.status(400).json({
            success: false,
            message: 'Query is required'
        });
    }

    logger.info(`AI Assistant query: ${query}`);

    try {
        // Get financial data for context
        const [incomes, expenses] = await Promise.all([
            IncomeModel.findAll(),
            ExpenseModel.findAll()
        ]);

        // Calculate basic financial metrics
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const balance = totalIncome - totalExpenses;

        // Group expenses by category
        const categorySpending = expenses.reduce((acc, expense) => {
            acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
            return acc;
        }, {});

        // Create context for AI
        const financialContext = {
            totalIncome: totalIncome.toFixed(2),
            totalExpenses: totalExpenses.toFixed(2),
            balance: balance.toFixed(2),
            transactionCount: incomes.length + expenses.length,
            categorySpending,
            recentTransactions: [...incomes.slice(-3), ...expenses.slice(-3)]
                .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                .slice(0, 5)
        };

        // Create prompt for AI assistant
        const prompt = `
You are a helpful financial assistant. Analyze the user's financial data and answer their question naturally.

Financial Data Summary:
- Total Income: $${financialContext.totalIncome}
- Total Expenses: $${financialContext.totalExpenses}
- Current Balance: $${financialContext.balance}
- Total Transactions: ${financialContext.transactionCount}

Category Spending Breakdown:
${Object.entries(financialContext.categorySpending)
    .map(([category, amount]) => `- ${category}: $${amount.toFixed(2)}`)
    .join('\n')}

Recent Transactions:
${financialContext.recentTransactions
    .map(t => `- ${t.title}: $${t.amount} (${t.type})`)
    .join('\n')}

User Query: "${query}"

Provide a helpful, conversational response that directly answers their question using the financial data above. Keep your response concise but informative. If they ask for advice, be practical and encouraging.
`;

        const response = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [{ role: 'user', content: prompt }],
            max_tokens: 300,
            temperature: 0.7
        });

        const aiResponse = response.choices[0].message.content;

        logger.info(`AI Assistant response generated`);

        res.status(200).json({
            success: true,
            query,
            response: aiResponse,
            context: {
                totalIncome: financialContext.totalIncome,
                totalExpenses: financialContext.totalExpenses,
                balance: financialContext.balance
            }
        });

    } catch (error) {
        logger.error('AI Assistant error:', error);

        // Fallback response when AI is unavailable
        const fallbackResponse = generateFallbackResponse(query);

        res.status(200).json({
            success: true,
            query,
            response: fallbackResponse,
            note: 'AI service temporarily unavailable, showing basic analysis'
        });
    }
});

/**
 * Generate fallback response when AI is unavailable
 */
function generateFallbackResponse(query) {
    const lowerQuery = query.toLowerCase();

    if (lowerQuery.includes('balance') || lowerQuery.includes('total')) {
        return "I'd love to help you check your balance! Please check your dashboard for the most up-to-date totals.";
    }

    if (lowerQuery.includes('spending') || lowerQuery.includes('expense')) {
        return "To analyze your spending patterns, please visit the dashboard where you can see detailed breakdowns by category.";
    }

    if (lowerQuery.includes('budget') || lowerQuery.includes('saving')) {
        return "For budget advice, check out the budget suggestions in your dashboard - they provide personalized recommendations!";
    }

    return "I'm here to help with your financial questions! Try asking about your balance, spending patterns, or budget suggestions.";
}

/**
 * @desc    Get financial health score and insights
 * @route   GET /api/v1/financial-health
 * @access  Public
 */
exports.getFinancialHealth = asyncHandler(async (req, res) => {
    try {
        const [incomes, expenses] = await Promise.all([
            IncomeModel.findAll(),
            ExpenseModel.findAll()
        ]);

        if (incomes.length === 0 && expenses.length === 0) {
            return res.status(200).json({
                success: true,
                score: 0,
                message: 'Add some transactions to get your financial health score!',
                insights: []
            });
        }

        // Calculate metrics
        const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0);
        const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

        // Category diversity score (more categories = better diversification)
        const categories = new Set(expenses.map(e => e.category));
        const categoryDiversity = Math.min(categories.size * 10, 30); // Max 30 points

        // Savings rate score (aim for 20%+ savings)
        const savingsScore = Math.min(savingsRate * 2.5, 40); // Max 40 points

        // Transaction consistency score
        const transactionScore = Math.min((incomes.length + expenses.length) * 2, 30); // Max 30 points

        // Calculate overall score
        const totalScore = Math.round(categoryDiversity + savingsScore + transactionScore);

        // Generate insights
        const insights = [];

        if (savingsRate < 15) {
            insights.push("Consider increasing your savings rate to at least 15-20% of income");
        } else if (savingsRate >= 20) {
            insights.push("Great job maintaining a healthy savings rate!");
        }

        if (categories.size < 3) {
            insights.push("Try tracking expenses in more categories for better insights");
        }

        if (totalExpenses > totalIncome) {
            insights.push("Your expenses exceed income - consider reviewing your budget");
        }

        // Get top spending category
        const topCategory = Object.entries(
            expenses.reduce((acc, exp) => {
                acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
                return acc;
            }, {})
        ).sort(([,a], [,b]) => b - a)[0];

        if (topCategory) {
            insights.push(`Your highest spending category is ${topCategory[0]} at $${topCategory[1].toFixed(2)}`);
        }

        logger.info(`Generated financial health score: ${totalScore}`);

        res.status(200).json({
            success: true,
            score: totalScore,
            metrics: {
                totalIncome: totalIncome.toFixed(2),
                totalExpenses: totalExpenses.toFixed(2),
                savingsRate: savingsRate.toFixed(1),
                transactionCount: incomes.length + expenses.length,
                categoryCount: categories.size
            },
            insights,
            grade: totalScore >= 80 ? 'Excellent' :
                   totalScore >= 60 ? 'Good' :
                   totalScore >= 40 ? 'Fair' : 'Needs Improvement'
        });

    } catch (error) {
        logger.error('Financial health calculation error:', error);
        res.status(200).json({
            success: true,
            score: 0,
            message: 'Unable to calculate financial health score at this time',
            insights: ['Please try again later']
        });
    }
});
