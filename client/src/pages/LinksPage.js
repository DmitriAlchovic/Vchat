import React, { useEffect, useRef, useState } from "react";
import * as socket from "socket.io-client";
import Peer from "peerjs";
//import './LinksPage.css';
import { useHistory } from "react-router";
import gazebo from '../assets/gazebo.png';



const myPeer = new Peer(undefined, {
  host: '/',
  port: '3001'
})

 export const LinksPage = () => {
    /* const socket = io({transports: ['websocket'], upgrade: false, reconection: false}); */
    const userVideoRef = [];
    let socketRef = useRef(null);
    const myVideoRef = useRef(null);
    userVideoRef[0] = useRef(null);
    userVideoRef[1] = useRef(null);
    userVideoRef[2] = useRef(null);
    userVideoRef[3] = useRef(null);
    userVideoRef[4] = useRef(null);
    userVideoRef[5] = useRef(null);
    userVideoRef[6] = useRef(null);
    const gameMasterVideoRef = useRef(null);
    const history = useHistory();
    const [muteIcon,setMuteIcon] = useState('mic_off');
    const [muteIconColor, setMuteIconColor] = useState('red');
    const user = {
      socketId:null,
      userId:null,
      streamId:null,
      userName:'JohnDoe',
      isGameMaster:false
    }
    let newUser;
    useEffect( () => {
      let pos;
    const peers = {}
    socketRef.current = socket.connect('http://localhost:5000',  {
      query:`data=${history.location.pathname}`
      
    });

    user.socketId = socketRef.current.io.engine.id;
    console.log('user',user);
    console.log('socket',socketRef.current.io.engine);
    console.log('socket',socketRef.current);
     socketRef.current.on('message', async position => {
      console.log(position);
       pos = await position; 
    })
    
    
      
      navigator.mediaDevices.getUserMedia({video: {width: 280, height: 400},
          audio: true })
        .then( stream => {
          let myVideo = myVideoRef.current;
          console.log(stream);
          addVideoStream(myVideo, stream)
          
        
          
          myPeer.on('open', id => {
            console.log('open user id = ', id);
            console.log(myPeer);
            user.socketId = socketRef.current.id;
            user.userId=id;
            
            /* userVideoRef[pos].current.srcObject = myVideoRef.current.srcObject; */
            addVideoStream(myVideoRef.current, myVideoRef.current.srcObject)
            socketRef.current.emit('join-room', history.location.pathname, id)
            socketRef.current.emit('user-info', user);
            socketRef.current.on("send-user-info", user => {
              
              console.log('from server', user);
              newUser=user.socketId;
              console.log('newUser',newUser);
            });
          })
          
          myPeer.on('call', call => {

            console.log('call');
            call.answer(stream);
            console.log(call);
            console.log(myPeer);
            
            let video;
            for (let i=0;i<userVideoRef.length; i++) {
              if (userVideoRef[i].current.srcObject === null) {
                video = userVideoRef[i].current;
                break;
              }
            }
            call.on('stream', userVideoStream => {
              console.log('call',userVideoStream);
              addVideoStream(video, userVideoStream)
            })
            socketRef.current.on("recive-info", user => {
              
              console.log('recived info', user);
              
            });
          })
  
          socketRef.current.on('user-connected', userId => {
            console.log('user-connected');
            console.log(user);
            
            connectToNewUser(userId, stream)
          })

      socketRef.current.on('disconnect', userId => {
       if (peers[userId]) peers[userId].close()
    })  
    
    function connectToNewUser(userId, stream) {
      const call = myPeer.call(userId, stream)
      console.log('connectToNewUser');
      console.log('call connect',call);
      //const video = React.createElement('video')
      let video;
      for (let i=0;i<userVideoRef.length; i++) {
        if (userVideoRef[i].current.srcObject === null){
      video = userVideoRef[i].current;
      break;
    }}
      call.on('stream', userVideoStream => {
        socketRef.current.emit('send-my-info', user,newUser);
        console.log('new user stream', userVideoStream);
        addVideoStream(video, userVideoStream)
      })
      call.on('close', () => {
        video.remove()
      })
    
      peers[userId] = call
    }

    function addVideoStream(video, stream) {
      console.log('addVideoStream');
      video.srcObject = stream
      console.log(userVideoRef);
       video.addEventListener('loadedmetadata', () => {
        video.play()
      })
    }

        })
        .catch(err => {
          console.log("error:", err);
        });
    
  });

  
  
  
  const muteUnmuteHandelr = async() =>{
    const enabled = myVideoRef.current.srcObject.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoRef.current.srcObject.getAudioTracks()[0].enabled = false;
      setMuteIcon('keyboard_voice');
      setMuteIconColor('green');
    } 
    else {
      myVideoRef.current.srcObject.getAudioTracks()[0].enabled = true;
      setMuteIcon('mic_off');
      setMuteIconColor('red');
    }
  }  

  return (
      <div>
        <table>
          <tbody>
            <tr>
              <td >
                <video  ref={gameMasterVideoRef} />
                <ul className="collection">
                  <li className="collection-item avatar">
                    <img src={gazebo} alt="" className="circle"/>
                    <span className="title">GameMaster:</span>
                    <a href="#!" className="secondary-content"><i className="material-icons">description</i></a>
                  </li>
                </ul>
              </td>

              <td className="gmVideoGrid">
                <video  ref={myVideoRef} /> 
                <ul className="collection">
                  <li className="collection-item avatar">
                    <img src="assets/gazebo.png" alt="" className="circle"/>
                    <span className="title">PlayerName:</span>
                    <a href="#!" className="secondary-content"><i className="material-icons">description</i></a>
                  </li>
                </ul>
              </td>

              <td className="gmVideoGrid">
                <video  ref={userVideoRef[0]} />
              </td>

              <td className="gmVideoGrid">
                <video  ref={userVideoRef[1]} />
              </td>

              <td className="gmVideoGrid">
                <video  ref={userVideoRef[2]} />
              </td>
              </tr>
              <tr>
                <td className="gmVideoGrid">
                  
                  <div className="input-field col s6">
                    <i className="material-icons prefix">mode_edit</i>
                    <textarea id="icon_prefix2" className="materialize-textarea"></textarea>
                    <label htmlFor="icon_prefix2">Enter message</label>
                   </div>
                </td>

                <td className="gmVideoGrid">
                  <video  ref={userVideoRef[3]} />
                </td>

                <td className="gmVideoGrid">
                 <video  ref={userVideoRef[4]} />
                </td>

                <td className="gmVideoGrid">
                  <video  ref={userVideoRef[5]} />
                </td>

                <td className="gmVideoGrid">
                  <video  ref={userVideoRef[6]} />
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

