import { eventNames } from "process";
import { useEffect,useRef,useState } from "react";
import { io } from "socket.io-client";
const socket = io('http://localhost:5000');
const VideoCall = ()=>{
    const [stream,setStream] =useState<MediaStream |null>(null);
    const [peerConnection,setPeerConnection] =useState<RTCPeerConnection |null>(null);
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const remoteVideoRef = useRef<HTMLVideoElement>(null);
       useEffect(()=>{
        socket.on('offer',async(offer)=>{
            const pC = new RTCPeerConnection();
            setPeerConnection(pC);
            await pC.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pC.createAnswer();
        await pC.setLocalDescription(answer)
        socket.emit('answer', answer);
 pC.ontrack=(event)=>{
    remoteVideoRef.current!.srcObject=event.streams[0]

 }

 pC.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit('candidate', event.candidate);
    }
  };
    
    })
    socket.on('answer', async (answer) => {
        if (peerConnection) {
          await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        }
      });
      return () => {
        socket.off('offer');
        socket.off('answer');
        socket.off('candidate');
      };
    }, [peerConnection]);
    
       })
}