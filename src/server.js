const express = require('express');
const { createClient } = require('redis');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 3034;

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

app.listen(3034, () => {
    console.log(`Discount API server is running on port ${PORT}`);
});