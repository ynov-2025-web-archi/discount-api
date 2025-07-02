const express = require('express');
require('dotenv').config();
const { createClient } = require('redis');

const app = express();
const PORT = process.env.PORT || 3034

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const initializeSubscribtionNewsletter = async () => {
    const subscriber = createClient({
        url: process.env.REDIS_URL || 'redis://localhost:6379' 
    });
    await subscriber.connect();
    await subscriber.subscribe('newsletter:subscribe', (message) => {
        // Fonctions // CONTROLLER 
        // générrer un code discount
        // fetch sur la serverless
        console.log('Received message:', message);
    });
}

initializeSubscribtionNewsletter();

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'Discount API is running',
        timestamp: new Date().toISOString(),
        database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'Route not found'
    });
});

app.listen(PORT, () => {
    console.log(`Discount API server is running on port ${PORT}`);
}); 