const express = require('express');
const cors = require('cors');
const compression = require('compression');
const { db } = require('./db/db');
const { readdirSync } = require('fs');
const dotenv = require('dotenv');

// Load environment variables from config.env file
dotenv.config({ path: './config/config.env' });

// Import professional middleware
const {
    securityHeaders,
    limiter,
    strictLimiter,
    corsOptions,
    requestLogger,
    sanitizeBody
} = require('./middleware/security');

const {
    errorHandler,
    asyncHandler,
    notFound,
    logger
} = require('./middleware/errorHandler');

const app = express();

// Trust proxy for rate limiting behind reverse proxy
app.set('trust proxy', 1);

// Get the PORT from environment variables
const PORT = process.env.PORT || 5000;

// Security middleware (must be first)
app.use(securityHeaders);

// Compression middleware
app.use(compression({
    level: 6,
    threshold: 100 * 1000, // 100kb
    filter: (req, res) => {
        if (req.headers['x-no-compression']) {
            return false;
        }
        return compression.filter(req, res);
    }
}));

// CORS middleware
app.use(cors(corsOptions));

// Rate limiting
app.use('/api/v1/', limiter);

// Request logging
app.use(requestLogger);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Input sanitization
app.use(sanitizeBody);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is healthy',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// API routes
readdirSync('./routes').map((route) => app.use('/api/v1', require('./routes/' + route)));

// 404 handler
app.use(notFound);

// Error handling middleware (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down gracefully');
    process.exit(0);
});

process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down gracefully');
    process.exit(0);
});

// Start the server
const server = () => {
    // Database is already initialized in db.js
    app.listen(PORT, () => {
        logger.info(`🚀 Server listening on port: ${PORT}`);
        logger.info(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
        logger.info(`🔒 Security: Enabled`);
        logger.info(`📝 Logging: Enabled`);
        logger.info(`🗄️  Database: Supabase`);
    });
};

server();
