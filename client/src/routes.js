import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LinksPage } from "./pages/LinksPage";
import { CreatePage } from "./pages/CreatePage";
import { DetailPage } from "./pages/DetailPage";
import { AuthPage } from "./pages/AuthPage";
import { UserInRoomContext } from "./context/UserInRoomContext";
import {useRole} from "./hooks/role.hook";
export const useRoutes = (isAuthenticated) => {
    const {isGameMaster,defineRole,character}=useRole();
  if (isAuthenticated) {
    return (
      <Switch>
        <UserInRoomContext.Provider
          value={{isGameMaster, defineRole, character}}
        >
          <Route path="/links/:id" exact>
            <LinksPage />
          </Route>
          <Route path="/create" exact>
            <CreatePage />
          </Route>
        </UserInRoomContext.Provider>
        <Route path="/detail/:id" exact>
          <DetailPage />
        </Route>
        <Route path="/socket.io/:id" exact></Route>
        <Redirect to="/create" />
      </Switch>
    );
  }
  return (
    <Switch>
      <Route path="/" exact>
        <AuthPage />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
