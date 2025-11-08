const { supabase } = require('../db/db');

class ExpenseModel {
    static async create(expenseData) {
        const { title, amount, type = 'expense', date, category, description } = expenseData;

        const { data, error } = await supabase
            .from('expenses')
            .insert([{
                title,
                amount: parseFloat(amount),
                type,
                date,
                category,
                description
            }])
            .select()
            .single();

        if (error) {
            throw new Error(`Failed to create expense: ${error.message}`);
        }

        return {
            _id: data.id.toString(),
            ...data
        };
    }

    static async findAll() {
        const { data, error } = await supabase
            .from('expenses')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch expenses: ${error.message}`);
        }

        return data.map(expense => ({
            _id: expense.id.toString(),
            ...expense
        }));
    }

    static async findByIdAndDelete(id) {
        const { error } = await supabase
            .from('expenses')
            .delete()
            .eq('id', parseInt(id));

        if (error) {
            throw new Error(`Failed to delete expense: ${error.message}`);
        }

        return true;
    }

    static async getCategoryTotals() {
        const { data, error } = await supabase
            .from('expenses')
            .select('category, amount');

        if (error) {
            throw new Error(`Failed to get category totals: ${error.message}`);
        }

        // Group by category and sum amounts
        const categoryTotals = data.reduce((acc, expense) => {
            if (!acc[expense.category]) {
                acc[expense.category] = 0;
            }
            acc[expense.category] += expense.amount;
            return acc;
        }, {});

        return Object.entries(categoryTotals).map(([category, total]) => ({
            category,
            total
        }));
    }
}

module.exports = ExpenseModel;
