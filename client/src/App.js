import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import 'materialize-css';
import 'material-icons/iconfont/material-icons.css';
import {useRoutes} from './routes';
import {useAuth} from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Loader } from './components/Loader';


function App() {
  const {token, login, logout, userId, ready, isGameMaster}= useAuth()
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <Loader />
  }

  return (
    
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated, isGameMaster
    }}>
    <Router>
      {isAuthenticated && <Navbar/>}
    <div /* className="container" */>
      {routes}
    </div>
    </Router>
    </AuthContext.Provider>
    
  );
}

export default App;
