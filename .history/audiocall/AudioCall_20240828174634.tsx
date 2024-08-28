import {useEffect,useState,useRef} from "react";
import { io } from "socket.io-client";
const socket = io('http://localhost:5000');

const AudioCall =()=>{
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudiosRef = useRef<{ [key: string]: HTMLAudioElement | null }>({});
    useEffect(()=>{
        socket.on('offer',async(offer:any,id:string)=>{
            const pC = new RTCPeerConnection();
            setPeerConnections(prev=>new Map(prev).set(id,pC));
       const answer = await pC.createAnswer();
       await pC.setLocalDescription(answer);

      
       socket.emit('answer',answer,id);
       pC.ontrack=(event)=>{
        const stream = event.streams[0];
        if (remoteAudiosRef.current[id]){
            remoteAudiosRef.current[id]!.srcObject=stream;
        }
       };
       pC.onicecandidate = (event) => {
        if (event.candidate) {
            socket.emit('candidate', event.candidate, id);
        }
    };


})
    })
}