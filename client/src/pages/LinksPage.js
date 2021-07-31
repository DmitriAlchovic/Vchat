import React, { useEffect, useRef, useState } from "react";
import * as socket from "socket.io-client";
import Peer from "peerjs";
//import './LinksPage.css';



const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

export const LinksPage = () => {
    
    let socketRef = useRef(null);
    const videoRef = useRef(null);
    const userVideoRef = useRef(null);
    const [muteIcon,setMuteIcon] = useState('mic_off');
    const [muteIconColor, setMuteIconColor] = useState('red')

   useEffect(() => {
    const peers = {}
    socketRef.current = socket.connect('http://localhost:5000/');
    console.log(socketRef);
    
      navigator.mediaDevices
        .getUserMedia({video: true,
          audio: true })
        .then(stream => {
          
          let myVideo = videoRef.current;
          myVideo.volume = 0;
          addVideoStream(myVideo, stream)
          myPeer.on('open', id => {
            console.log(id);
            socketRef.current.emit('join-room', '123', id)
          })
  
          myPeer.on('call', call => {
            console.log('call');
            call.answer(stream)
            //const video = React.createElement('video')
            let newUserVideo = userVideoRef.current;
            call.on('stream', userVideoStream => {
              addVideoStream(newUserVideo, userVideoStream)
            })
          })
  
        socketRef.current.on('user-connected', userId => {
          console.log('user-connected');
      connectToNewUser(userId, stream)
    })

      socketRef.current.on('user-disconnected', userId => {
      if (peers[userId]) peers[userId].close()
    })  
    
    function connectToNewUser(userId, stream) {
      const call = myPeer.call(userId, stream)
      console.log('connectToNewUser');
      //const video = React.createElement('video')
      let video = userVideoRef.current;
      call.on('stream', userVideoStream => {
        addVideoStream(video, userVideoStream)
      })
      call.on('close', () => {
        video.remove()
      })
    
      peers[userId] = call
    }

  

        })
        .catch(err => {
          console.log("error:", err);
        });
    
  }, []);

  
  function addVideoStream(video, stream) {
    console.log('addVideoStream');
    video.srcObject = stream
    video.addEventListener('loadedmetadata', () => {
      video.play()
    })
    //videoRef.append(video)
  }
  
  const muteUnmuteHandelr = async() =>{
    const enabled = videoRef.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
      videoRef.current.srcObject.getAudioTracks()[0].enabled = false;
      setMuteIcon('keyboard_voice');
      setMuteIconColor('green');
    } 
    else {
      videoRef.current.srcObject.getAudioTracks()[0].enabled = true;
      setMuteIcon('keyboard_voice');
      setMuteIconColor('green');
      setMuteIcon('mic_off');
      setMuteIconColor('red');
    }
  }  

  return (
      <div>
        <table>
          <tbody>
            <tr>
              <td className="gmVideoGrid">
                <video  ref={videoRef} />
              </td>
              <td className="gmVideoGrid">
                <video  ref={userVideoRef} /> 
              </td>
            </tr>
          </tbody>
        </table>
        <div className = "muteButton">
          <a href="#/" className={"btn-floating btn-large waves-effect waves-light " + muteIconColor} 
      onClick={muteUnmuteHandelr} 
      ><i className="material-icons">{muteIcon}
      </i></a>
      </div>
      </div>
  );
};

