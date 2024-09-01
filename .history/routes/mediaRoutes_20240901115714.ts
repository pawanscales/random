import express, {Request,Response} from "express";

import { addMediaToMessage } from "@/services/mediaServices";
import { getMediaForMessage } from "@/services/mediaServices";
const router = express.Router();
router.post('/add', async (req:Request,res:Response)=>{
    const {mediaType,mediaUrl,messageId} =req.body;
    try{
        const media= await addMediaToMessage(messageId,mediaType,mediaUrl);

        res.status(201).json(media);
        
    }
    catch(error){
        res.status(500).json(
            {
                error:"failed to add media"
            }
        )
    }
})
router.get('/for-message/:messageId' ,async)