import React, { useEffect, useRef, useState, useContext } from "react";
import gazebo from "../assets/gazebo.png";
import noAvatar from "../assets/noavatar.jpg";
import { useMessage } from "../hooks/message.hook";
import { useHttp } from "../hooks/http.hook";
import { AuthContext } from "../context/AuthContext";

export const SideNav = () => {
  const sidenavRef = useRef(null);
  const message = useMessage();
  const {  request, error, clearError } = useHttp();
  const collapsibleRef = useRef(null);
  const auth = useContext(AuthContext);
  const [friendsList, setFriendsList] = useState();
  const [newFriend, setNewFriend] = useState({
    friendName: "",
    friendEmail: "",
  });

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  useEffect(() => {
    window.M.Sidenav.init(sidenavRef, { edge: "left", inDuration: 250 });
    window.M.Collapsible.init(collapsibleRef);
  }, []);

const addFriendHandler = async () => {
    try {
      const data = await request("/api/friend/add", "POST", {
        userId: auth.userId,
        ...newFriend,
      });
      message(data.message);
    } catch (e) {}
  };
  useEffect(async () => {
    try {
      const data = await request(
        "/api/friend/list",
        "POST",
        { userId: auth.userId },
        {
          Authorization: `Bearer ${auth.token}`,
        }
      );
       const selectFriendsList = data.friendsList.map(({ nickname, email }) => (
        <a key={email}>
           {nickname} 
            <label> {email} </label>
          </a>
      ));
      return setFriendsList(selectFriendsList);
    } catch (e) {}
  }, []);


  const changeHandler = (event) => {
    setNewFriend({ ...newFriend, [event.target.name]: event.target.value });
  };

  

  return (
    <div>
      <ul id="slide-out" className="sidenav" ref={sidenavRef}>
        <li>
          <div className="user-view">
            <div className="background">
              <img src={gazebo} />
            </div>
            <a href="#user">
              <img className="circle" src={noAvatar} />
            </a>
            <a href="#name">
              <span className="white-text name">{auth.userName}</span>
            </a>
            <a href="#email">
              <span className="white-text email">{auth.userEmail}</span>
            </a>
          </div>
        </li>
        <li>
          <div className="divider"></div>
        </li>

        <li>
          <div className="divider"></div>
        </li>
        <ul ref={collapsibleRef} className="collapsible grey">
          <li>
            <div className="collapsible-header black-text">
              {" "}
              <i className="material-icons prefix green-text">person_add</i>Add
              friend{" "}
            </div>
            <div className="collapsible-body black-text">
              <form className="col s12">
                <div className="row">
                  <div className="input-field col s11">
                    <i className="material-icons prefix">account_circle</i>
                    <input
                      id="icon_prefix"
                      type="text"
                      className="validate"
                      name="friendName"
                      value={newFriend.friendName}
                      onChange={changeHandler}
                    />
                    <label htmlFor="icon_prefix">Name</label>
                  </div>
                </div>
              </form>
              <form className="col s12">
                <div className="row">
                  <div className="input-field col s11">
                    <i className="material-icons prefix">email</i>
                    <input
                      id="icon_email"
                      type="email"
                      className="validate"
                      name="friendEmail"
                      value={newFriend.friendEmail}
                      onChange={changeHandler}
                    />
                    <label htmlFor="icon_email">Email adress</label>
                  </div>
                </div>
              </form>
              <a
                className="waves-effect waves-light btn"
                onClick={addFriendHandler}
              >
                Add friend
              </a>
            </div>
          </li>
        </ul>
        <li>
          <a className="subheader black-text">Friends</a>
        </li>
        <li><div className="divider"></div></li>
        <li>
          {friendsList}
        </li>
      </ul>
      <a
        ref={sidenavRef}
        href=""
        data-target="slide-out"
        className="sidenav-trigger show-on-large"
      >
        <i className="material-icons">menu</i>
      </a>
    </div>
  );
};
