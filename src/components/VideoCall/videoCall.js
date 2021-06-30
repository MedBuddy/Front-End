import React, { useEffect, useRef, useState } from 'react'
import './videoCall.css'
import Peer from 'simple-peer'
import io from 'socket.io-client'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import { Input, Button } from 'reactstrap'
import { videoCallUrl } from '../../host'

const socket = io.connect(videoCallUrl)

function VideoCall(){

    const [myId, setMyId] = useState('')
    const [stream, setStream] = useState()
    const [receivingCall, setReceivingCall] = useState(false)
    const [caller, setCaller] = useState('')
    const [callerSignal, setCallerSignal] = useState()
    const [callAccepted, setCallAccepted] = useState(false)
    const [idToCall, setIdToCall] = useState('')
    const [callEnded, setCallEnded] = useState(false)
    const [name, setName] = useState('')
    const [videoOn, setVideo] = useState(true)
    const [audioOn, setAudio] = useState(true)

    const myVideo = useRef()
    const userVideo = useRef()
    const connectionRef = useRef()

    useEffect(() => {
        let token = localStorage.getItem('userToken')
        if(!token)
            window.location.href = '/login'
    })

    useEffect(() => {
        setAudio(true)
        setVideo(true)
        navigator.mediaDevices.getUserMedia({video: videoOn, audio: audioOn}) 
            .then(stream => {
                stream.getTracks().forEach((track, index) => {
                    if(!videoOn && track.kind === 'video')
                        track.enabled = false
                    if(!audioOn && track.kind === 'audio')
                        track.enabled = false
                })
                setStream(stream)
                myVideo.current.srcObject = stream
            })
    }, [audioOn, videoOn])

    useEffect(() => {
        socket.on('myId', id => {
            setMyId(id)
        })

        socket.on('call-user', data => {
            setReceivingCall(true)
            setCaller(data.from)
            setName(data.name)
            setCallerSignal(data.signal)
        })
    }, [stream])

    const callUser = (id) => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream
        })

        peer.on('signal', data => {
            socket.emit('call-user', {
                userToCall: id,
                signalData: data,
                from: myId,
                name: name
            })
        })

        peer.on('stream', stream => {
            userVideo.current.srcObject = stream
        })

        socket.on('callAccepted', signal => {
            setCallAccepted(true)
            peer.signal(signal)
        })

        connectionRef.current = peer
    }

    const answerCall = () => {
        setCallAccepted(true)
        const peer = new Peer({
            initiator: false,
            trickle: false,
            stream: stream
        })

        peer.on('signal', data => {
            socket.emit('answer-call', {
                signal: data,
                to: caller
            })
        })

        peer.on('stream', stream => {
            userVideo.current.srcObject = stream
        })

        peer.signal(callerSignal)
        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true)
        connectionRef.current.destroy()
    }
    
    return (
        <>
            <h1 style={{textAlign: 'center'}}>Video Consultation</h1>
            <div className="video-page-container">
                <div className="video-container">
                    <div className="video">
                        {stream && <video playsInline muted ref={myVideo} autoPlay />}
                    </div>
                    <div className="video">
                        {callAccepted && !callEnded ?
                        <video playsInline ref={userVideo} autoPlay /> : null}
                    </div>
                    {/* <div className="control-btns">
                        <Button className="btn btn-primary" onClick={() => setAudio(audio => audio = !audio)}>
                            Audio {audioOn?'On':'Off'}
                        </Button>
                        <Button className="btn btn-primary" onClick={() => setVideo(video => video = !video)}>
                            Video {videoOn?'On':'Off'}
                        </Button>
                    </div> */}
                </div>
                <div className="myId">
                    <Input id="filled-basic" value={name} onChange={e => setName(e.target.value)} style={{marginBottom: '20px'}} />
                    <CopyToClipboard text={myId} style={{marginBottom: '2rem'}}>
                        <Button className="btn" color="info">Copy ID</Button>
                    </CopyToClipboard>
                    <Input id="filled-basic" value={idToCall} onChange={e => setIdToCall(e.target.value)} />
                    <div className="call-button">
                        {callAccepted && !callEnded ? (
                            <Button className="btn" color="danger" onClick={leaveCall}>
                                End Call
                            </Button>
                            ) : (
                            <Button className="btn" color="primary" onClick={() => callUser(idToCall)}>
                                Call
                            </Button>
                        )}
                    </div>
                </div>
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller">
                            <h1>{name} is calling...</h1>
                            <Button className="btn" color="primary" onClick={answerCall}>
                                Answer
                            </Button>
                        </div>
                    ) : null}
                </div>
            </div>
        </>
    )
}

export default VideoCall