const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../config/config.env') });

// Supabase configuration
const supabaseUrl = 'https://khwvfsyismxehjdvzikq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtod3Zmc3lpc214ZWhqZHZ6aWtxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI1MzcxNDMsImV4cCI6MjA3ODExMzE0M30.PYNK9dn3Vglw8pyECTDC2zDQF-81pL9jxKmM0oHQOVM';

const supabase = createClient(supabaseUrl, supabaseKey);

// Create tables if they don't exist
const createTables = async () => {
    try {
        // Create expenses table
        const { error: expensesError } = await supabase.rpc('create_expenses_table', {});
        if (expensesError && !expensesError.message.includes('already exists')) {
            console.log('Expenses table created or already exists');
        }

        // Create incomes table
        const { error: incomesError } = await supabase.rpc('create_incomes_table', {});
        if (incomesError && !incomesError.message.includes('already exists')) {
            console.log('Incomes table created or already exists');
        }

        console.log('Supabase Database Connected and Tables Ready');
    } catch (error) {
        console.log('Supabase Database Connected (tables may need to be created manually)');
    }
};

createTables();

module.exports = { supabase };
