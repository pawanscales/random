import {useEffect,useState,useRef} from "react";
import { io } from "socket.io-client";
const socket = io()