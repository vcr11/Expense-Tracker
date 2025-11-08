const { supabase } = require('../db/db');

class IncomeModel {
    static async create(incomeData) {
        const { title, amount, type = 'income', date, category, description } = incomeData;

        const { data, error } = await supabase
            .from('incomes')
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
            throw new Error(`Failed to create income: ${error.message}`);
        }

        return {
            _id: data.id.toString(),
            ...data
        };
    }

    static async findAll() {
        const { data, error } = await supabase
            .from('incomes')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw new Error(`Failed to fetch incomes: ${error.message}`);
        }

        return data.map(income => ({
            _id: income.id.toString(),
            ...income
        }));
    }

    static async findByIdAndDelete(id) {
        const { error } = await supabase
            .from('incomes')
            .delete()
            .eq('id', parseInt(id));

        if (error) {
            throw new Error(`Failed to delete income: ${error.message}`);
        }

        return true;
    }
}

module.exports = IncomeModel;
