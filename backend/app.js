const express = require('express');
const cors = require('cors');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const app = express();

// Get the PORT from environment variables
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(express.json());
app.use(cors());

// Routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));

// Start the server
const server = () => {
    db(); // Connect to the database
    app.listen(PORT, () => {
        console.log('Server listening on port:', PORT);
    });
};

server();
