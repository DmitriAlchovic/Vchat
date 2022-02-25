import React, { useEffect, useRef, useState, useContext } from "react";
import * as socket from "socket.io-client";
import Peer from "peerjs";
import { useHistory } from "react-router";
import gazebo from "../assets/gazebo.png";
import { AuthContext } from "../context/AuthContext";
import { UserInRoomContext } from "../context/UserInRoomContext";
import noAvatar from "../assets/noavatar.jpg";

const myPeer = new Peer(undefined, {
  host: "/",
  port: "3001",
});

export const LinksPage = () => {
  const userVideoRef = [];
  const { isGameMaster, character } = useContext(UserInRoomContext);
  let socketRef = useRef(null);
  userVideoRef[0] = useRef(null);
  userVideoRef[1] = useRef(null);
  userVideoRef[2] = useRef(null);
  userVideoRef[3] = useRef(null);
  userVideoRef[4] = useRef(null);
  userVideoRef[5] = useRef(null);
  const gameMasterVideoRef = useRef(null);
  const history = useHistory();
  const auth = useContext(AuthContext);
  const [muteIcon, setMuteIcon] = useState("mic_off");
  const [muteIconColor, setMuteIconColor] = useState("red");
  const [videoIcon, setVideoIcon] = useState("videocam_off");
  const [videoIconColor, setVideoIconColor] = useState("red");
  let [topGrid, setTopGrid] = useState();
  const [bottomGrid, setBottomGrid] = useState();
  const streams = [];
  const top = [];
  const bottom = [];
  let newUser = {};
  const user = {
    socketId: null,
    userId: null,
    streamId: null,
    userName: auth.userName,
    GameMaster: isGameMaster,
    character: character,
  };
  let myStream;
  let streamId = "";
  let previouStremam = "";
  const myVideoRef = user.GameMaster ? gameMasterVideoRef : userVideoRef[0];
  useEffect(() => {
    const peers = {};
    socketRef.current = socket.connect("http://localhost:5000", {
      query: `data=${history.location.pathname}`,
    });

    navigator.mediaDevices
      .getUserMedia({ video: { width: 320, height: 240 }, audio: true })
      .then((stream) => {
        user.streamId = stream.id;
        myPeer.on("open", (id) => {
          user.socketId = socketRef.current.id;
          user.userId = id;
          myStream = stream;
          addVideoStream(user, stream);
          socketRef.current.emit("join-room", history.location.pathname, id);
          socketRef.current.emit("user-info", user);
          socketRef.current.on("send-user-info", (userFromServer) => {
            newUser = userFromServer;
          });
        });

        myPeer.on("call", (call) => {
          call.answer(stream);
          socketRef.current.on("recive-info", (user) => {
          });
          call.on("stream", (userVideoStream) => {
            if (previouStremam !== userVideoStream.id) {
              previouStremam = userVideoStream.id;
              addVideoStream(call.metadata, userVideoStream);
            }
          });
        });

        socketRef.current.on("user-connected", (userId) => {

          connectToNewUser(userId, stream);
        });

        socketRef.current.on("disconnect", (userId) => {
          if (peers[userId]) peers[userId].close();
        });

        function connectToNewUser(userId, stream) {
          const call = myPeer.call(userId, stream, { metadata: user });

          call.on("stream", (userVideoStream) => {
            if (streamId !== userId) {
              socketRef.current.emit(
                "send-my-info",
                socketRef.current.id,
                user,
                newUser
              );
              streamId = userId;
              addVideoStream(newUser, userVideoStream);
            }
          });
          call.on("close", () => {
            //video.remove();
          });

          peers[userId] = call;
        }
      });
  }, []);

  const addVideoStream = (user, stream) => {
    if (!user.isGameMaster) {
      streams.push(user);
      top.push(stream);

      const topGridDisplay = streams.map(({ streamId, userId }, index) => {
        if (index % 2 == 0)
          return (
            <div className="col s3 center-align" key={userId}>
              <video
                autoPlay
                className="col s13"
                ref={userVideoRef[index]}
                poster={gazebo}
              />
              <div>
                <img
                  src={noAvatar}
                  alt="Contact Person"
                  className=" in-room-avatar col s3 circle"
                />
                <div className="room-player-name card-panel orange col s9 offset-by 3">
                  test5 as Lamar Mambuda
                  <a href="#!" className="secondary-content">
                    <i className="material-icons">description</i>
                  </a>
                </div>
              </div>
            </div>
          );
      });
      console.log(topGridDisplay, "Display");
      setTopGrid(topGridDisplay);
      bottom.push(user);
      const bottomGridDisplay = streams.map(({ streamId, userId }, index) => {
        if (index % 2 != 0)
          return (
            <div className="col s3 center-align" key={userId}>
              <video
                autoPlay
                className="col s13"
                ref={userVideoRef[index]}
                poster={gazebo}
              />
              <div>
                <img
                  src={noAvatar}
                  alt="Contact Person"
                  className=" in-room-avatar col s3 circle"
                />
                <div className="room-player-name card-panel orange col s9 offset-by 3">
                  PlayerName:John Doe
                  <a href="#!" className="secondary-content">
                    <i className="material-icons">description</i>
                  </a>
                  <div></div>
                </div>
              </div>
            </div>
          );
      });
      console.log(bottomGridDisplay, "bottomGrid");
      setBottomGrid(bottomGridDisplay);

      console.log(userVideoRef, "ref");
      console.log(top, "tpp");
      for (let i = 0; i < top.length; i++) {
        userVideoRef[i].current.srcObject = top[i];
        console.log(top[i], "topI");
        console.log(streams, "streams");
        userVideoRef[i].current.addEventListener("loadedmetadata", () => {
          userVideoRef[i].current.play();
        });
      }
    }
  };

  const muteUnmuteHandelr = () => {
    const enabled = myStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myStream.getAudioTracks()[0].enabled = false;
      setMuteIcon("keyboard_voice");
      setMuteIconColor("green");
    } else {
      myStream.getAudioTracks()[0].enabled = true;
      setMuteIcon("mic_off");
      setMuteIconColor("red");
    }
  };

  const offOnVideoHandelr = () => {
    let enabled = myVideoRef.current.srcObject.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoRef.current.srcObject.getVideoTracks()[0].enabled = false;
      setVideoIcon("videocam");
      setVideoIconColor("green");
    } else {
      myVideoRef.current.srcObject.getVideoTracks()[0].enabled = true;
      setVideoIcon("videocam_off");
      setVideoIconColor("red");
    }
  };

  return (
    <div>
      <div className="row">
        <div className="col s12">
          <div className="col s3">
            <video
              className="col s13"
              ref={gameMasterVideoRef}
              poster={gazebo}
            />
            <div>
              <img
                src={noAvatar}
                alt="Contact Person"
                className="in-room-avatar col s3 circle"
              />
              <div className="room-player-name card-panel orange col s9 offset-by 3">
                GameMaster: test3
                <a href="#!" className="secondary-content"></a>
                <div></div>
              </div>
            </div>
          </div>

          {topGrid}
        </div>
        <div className="col s12">
          <div className="col s3">
            <div className="input-field">
              <div className="chat-box">
                <div className="card-panel blue right-align col s12">
                  Welcome to the text chat
                </div>
                <div className="card-panel blue col s7 offset-by 5">text2</div>
              </div>
            </div>
            <div className="input-field col s12">
              <i className="material-icons prefix">send</i>
              <input id="icon_prefix2" type="text" className="validate"></input>
              <label forhtml="icon_prefix2">Enter message</label>
            </div>
          </div>

          {bottomGrid}
        </div>
      </div>

      <div className="align center">
        <a
          className={
            "btn-floating btn-large waves-effect waves-light " + muteIconColor
          }
          onClick={muteUnmuteHandelr}
        >
          <i className="material-icons">{muteIcon}</i>
        </a>
        <a
          style={{ margin: 10 }}
          className={
            "btn-floating btn-large waves-effect waves-light " + videoIconColor
          }
          onClick={offOnVideoHandelr}
        >
          <i className="material-icons">{videoIcon}</i>
        </a>
        <a
          style={{ margin: 10 }}
          className={"btn-floating btn-large waves-effect waves-light gray"}
        >
          <i className="material-icons">exit_to_app</i>
        </a>
      </div>
    </div>
  );
};
