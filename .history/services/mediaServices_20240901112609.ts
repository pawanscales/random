import { PrismaClient,Media } from "@prisma/client";
const prisma = PrismaClient()
export async function addMediaToMessage(messageId:number,mediaUrl:string,mediaType:string):Promise<Media>{
    return prisma.media.create({
        
    })
}