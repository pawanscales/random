import { PrismaClient,Message } from "@prisma/client";
import { data } from "autoprefixer";

const prisma = new PrismaClient();
export async function sendMessage(senderId:number,content:string):Promise<Message>{
    return prisma.message.create(
        {
            data:{
                content,senderId
            }
        }
    )
}


export async function 