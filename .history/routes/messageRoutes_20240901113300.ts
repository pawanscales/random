import express, { Request, Response } from 'express'; // Import express and types correctly

import { sendMessage, } from "@/services/messageServices";
import { getMessageHistory } from "@/services/messageServices";
const router =express.router();