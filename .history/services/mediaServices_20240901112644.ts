import { PrismaClient,Media } from "@prisma/client";
import { data } from "autoprefixer";
const prisma = PrismaClient()
export async function addMediaToMessage(messageId:number,mediaUrl:string,mediaType:string):Promise<Media>{
    return prisma.media.create({
        data:{
            url:mediaUrl,
            type:mediaType,
            messageId
        }
    })
}
export async function 