import express from 'express';
import { message, initializeChat } from '../services/chatService.js';

const router = express.Router();

router.post('/initialize', async (req, res) => {
    try {
        await initializeChat();
        res.json({ success: true, message: 'Chat initialized successfully' });
        console.log("Chat initialized successfully");
    } catch (error) {
        console.error('Error in /api/chat/initialize:', error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/message', async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt) {
            return res.status(400).json({ error: 'prompt is required' });
        }

        const response = await message(prompt);
        res.json({ response });
    } catch (error) {
        console.error('Error in /api/chat/message:', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;