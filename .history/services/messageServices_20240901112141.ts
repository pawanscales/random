import { PrismaClient,Message } from "@prisma/client";

const prisma = new PrismaClient();
export async function sendMessage(senderId:number,content:string){}