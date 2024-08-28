import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io('http://localhost:5000');

const AudioCall = () => {

    const [stream, setStream] = useState<MediaStream | null>(null);
    const [peerConnections, setPeerConnections] = useState<Map<string, RTCPeerConnection>>(new Map());
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
    const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudiosRef = useRef<{ [key: string]: HTMLAudioElement | null }>({});


    useEffect(() => {
        socket.on('offer', async (offer: any, id: string) => {
            const pC = new RTCPeerConnection();
            setPeerConnections(prev => new Map(prev).set(id, pC));

            await pC.setRemoteDescription(new RTCSessionDescription(offer));

            const answer = await pC.createAnswer();
            await pC.setLocalDescription(answer);
            socket.emit('answer', answer, id);

            pC.ontrack = (event) => {
                const stream = event.streams[0];
                if (remoteAudiosRef.current[id]) {
                    remoteAudiosRef.current[id]!.srcObject = stream;
                }
            };

            pC.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('candidate', event.candidate, id);
                }
            };
        });

        socket.on('answer', async (answer: any, id: string) => {
            const pc = peerConnections.get(id);
            if (pc) {
                await pc.setRemoteDescription(new RTCSessionDescription(answer));
            }
        });

        socket.on('candidate', async (candidate: any, id: string) => {
            const pc = peerConnections.get(id);
            if (pc) {
                await pc.addIceCandidate(new RTCIceCandidate(candidate));
            }
        });

        return () => {
            socket.off('offer');
            socket.off('answer');
            socket.off('candidate');
        };
    }, [peerConnections]);

    const startCall = async () => {
        const localStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (localAudioRef.current) {
            localAudioRef.current.srcObject = localStream;
        }
        setStream(localStream);

        peerConnections.forEach(pc => {
            localStream.getTracks().forEach(track => {
                pc.addTrack(track, localStream);
            });
        });
    };
    const startRecording =()=>{
        if (stream){
            const recorder = new MediaRecorder(stream);
            setMediaRecorder(recorder);
            reco
            
        }
    }
    return (
        <div>
            <audio ref={localAudioRef} autoPlay muted />
            {Object.keys(peerConnections).map(id => (
                <audio
                    key={id}
                    ref={el => remoteAudiosRef.current[id] = el as HTMLAudioElement}
                    autoPlay
                />
            ))}
            <button onClick={startCall}>Start Audio Call</button>
        </div>
    );
};

export default AudioCall;
