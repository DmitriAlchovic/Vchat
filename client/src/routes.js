import React from 'react';
import {Switch, Route, Redirect} from 'react-router-dom';
import { LinksPage } from './pages/LinksPage';
import { CreatePage } from './pages/CreatePage';
import { DetailPage } from './pages/DetailPage';
import { AuthPage } from './pages/AuthPage';
export const useRoutes = isAuthenticated => {
if (isAuthenticated) {
    return (
        <Switch>
            <Route path="/links/:id" exact>
                <LinksPage />
            </Route>
            <Route path="/create" exact>
                <CreatePage />
            </Route>
            <Route path="/detail/:id" exact>
                <DetailPage />
            </Route>
            <Route path="/socket.io/:id" exact>
                
            </Route>
             <Redirect to="/create" /> 
        </Switch>
    )
}
return (
    <Switch>
        <Route path ="/" exact>
            <AuthPage />
        </Route>
         <Redirect to ="/" />
    </Switch>
)
}