import express from 'express';
import { message, initializeChat } from '../services/Chat_service.js';

const router = express.Router();

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

router.get('/intialize', async (req, res) => {
    try{
        initializeChat();
        console.log('chat initialized')
    }
    catch{
        console.error('Error in /api/chat/intialize:', error);
        res.status(400).json({ error: error.message });
    }
})

export default router;