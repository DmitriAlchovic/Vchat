import React from 'react';
import {BrowserRouter as Router} from 'react-router-dom';
import 'materialize-css';
import 'material-icons/iconfont/material-icons.css';
import {useRoutes} from './routes';
import {useAuth} from './hooks/auth.hook'
import { AuthContext } from './context/AuthContext';
import { Loader } from './components/Loader';


function App() {
  const {token, login, logout, userId, ready, isGameMaster,userName,userEmail}= useAuth()
  const isAuthenticated = !!token;
  const routes = useRoutes(isAuthenticated)

  if (!ready) {
    return <Loader />
  }

  return (
    
    <AuthContext.Provider value={{
      token, login, logout, userId, isAuthenticated, isGameMaster, userName, userEmail
    }}>
    <Router>
    <div >
      {routes}
    </div>
    </Router>
    </AuthContext.Provider>
    
  );
}

export default App;
