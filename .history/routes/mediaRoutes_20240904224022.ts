import express, { Request, Response } from "express";
import { addMediaToMessage, getMediaForMessage } from "@/services/mediaServices";

const router = express.Router();

router.post('/add', async (req: Request, res: Response) => {
    const { mediaType, mediaUrl, messageId } = req.body;
    try {
        const media = await addMediaToMessage(messageId, mediaType, mediaUrl);
        res.status(201).json(media);
    } catch (error) {
        res.status(500).json({ error: "Failed to add media" });
    }
});

router.get('/for-message/:messageId', async (req: Request, res: Response) => {
    const { messageId } = req.params;
    try {
        const media = await getMediaForMessage(parseInt(messageId, 10));
        res.status(200).json(media);
    } catch (error) {
        res.status(500).json({ error: "Failed to fetch media" });
    }
});

export default router;
