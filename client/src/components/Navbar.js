import React, {useContext} from 'react';
import {NavLink, useHistory} from 'react-router-dom';
import {AuthContext} from '../context/AuthContext';
import { SideNav } from './SideNav';
import {CreateCharacterModal} from './CreateCharacterModal';

export const Navbar = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);

  const logoutHandler = event => {
    event.preventDefault();
    auth.logout();
    history.push('/');
  }

  return (
    <nav>
      <div className="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
        <SideNav trigger={<button></button>}
                options={{ closeOnClick: true }}/>
        <span className="brand-logo">Roleplay Video Chat</span>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          <li><CreateCharacterModal></CreateCharacterModal></li>
          <li><NavLink to="/links">Links</NavLink></li>
          <li><a href="/" onClick={logoutHandler}>Logout</a></li>
        </ul>
      </div>
    </nav>
  )
}