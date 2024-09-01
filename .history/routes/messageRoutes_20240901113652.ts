import express, { Request, Response } from 'express'; 
import { sendMessage, } from "@/services/messageServices";
import { getMessageHistory } from "@/services/messageServices";
const router =express.Router();
 router.post('/send-message' ,async (req:Request,res:Response)=>{
    try{
        const results = await sendMessage(req.body);
        res.status(200).json(results)
    }
    catch(error){
        res.status(500).json({
            error: 'Failed to send message'
        })
    }
 })
 router.get('message-history',async (req:Request,res:Response)=>{
    try{
        const results = await getMessageHistory();
        res.status(200).json(results);

    }
    catch(error){
        res.status(500).json(
            {
                error:"failed to get message history"
            }
        )
    }
 })