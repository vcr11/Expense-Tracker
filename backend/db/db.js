const mongoose = require('mongoose');
require('dotenv').config(); // Ensure this is at the top of your file

const db = async () => {
    try {
        mongoose.set('strictQuery', false); // This suppresses warnings about strict query mode
        await mongoose.connect(process.env.MONGO_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Database Connected');
    } catch (error) {
        console.error('DB Connection Error:', error.message);
    }
};

module.exports = { db };
