import React, { useEffect, useRef } from "react";
import gazebo from "../assets/gazebo.png";

export const SideNav = () => {
  const sidenavRef = useRef(null);
  useEffect(() => {
    window.M.Sidenav.init(sidenavRef, { edge: "left", inDuration: 250 });
  }, []);
  return (
    <div>
      <ul id="slide-out" className="sidenav" ref={sidenavRef}>
        <li>
          <div className="user-view">
            <div className="background">
              <img src={gazebo} />
            </div>
            <a href="#user">
              <img className="circle" src={gazebo} />
            </a>
            <a href="#name">
              <span className="white-text name">John Doe</span>
            </a>
            <a href="#email">
              <span className="white-text email">dummy@mail.com</span>
            </a>
          </div>
        </li>
        <li>
          <a className="subheader">Add friend
          </a>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
            <form className="col s12">
              <div className="row">
                <div className="input-field col s11">
                  <i className="material-icons prefix">account_circle</i>
                  <input id="icon_prefix" type="text" className="validate" />
                  <label htmlFor="icon_prefix">Name</label>
                </div>
              </div>
            </form>
        </li>
        <li>
            <form className="col s12">
              <div className="row">
                <div className="input-field col s11">
                  <i className="material-icons prefix">email</i>
                  <input id="icon_telephone" type="tel" className="validate" />
                  <label htmlFor="icon_telephone">Email adress</label>
                </div>
              </div>
            </form>
        </li>
        <li>
          <div className="divider"></div>
        </li>
        <li>
          <a className="subheader">Subheader</a>
        </li>
        <li>
          <a className="waves-effect" href="#!">
            Third Link With Waves
          </a>
        </li>
      </ul>
      <a
        ref={sidenavRef}
        href="#"
        data-target="slide-out"
        className="sidenav-trigger show-on-large"
      >
        <i className="material-icons">menu</i>
      </a>
    </div>
  );
};
