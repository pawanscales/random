// src/routes/messageRoutes.ts

import express, { Request, Response } from 'express';
import { sendMessage, getMessageHistory } from '../services/messageService';

const router = express.Router();

router.post('/send', async (req: Request, res: Response) => {
  const { senderId, content } = req.body;
  try {
    const message = await sendMessage(senderId, content);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
});

router.get('/history', async (req: Request, res: Response) => {
  try {
    const messages = await getMessageHistory();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch message history' });
  }
});

export default router;
