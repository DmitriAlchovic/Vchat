import React, { useState } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import { LinksPage } from "./pages/LinksPage";
import { CreatePage } from "./pages/CreatePage";
import {  SettingsPage } from "./pages/SettingsPage";
import { AuthPage } from "./pages/AuthPage";
import { UserInRoomContext } from "./context/UserInRoomContext";
import { useRole } from "./hooks/role.hook";
import { Navbar } from './components/Navbar';
export const useRoutes = (isAuthenticated) => {
  const { isGameMaster, defineMasterRole, defineCharacter, character } =
    useRole();
  if (isAuthenticated) {
    return (
      <Switch>
        <Route path="/links/:id" exact>
          <UserInRoomContext.Provider
            value={{
              isGameMaster,
              defineMasterRole,
              defineCharacter,
              character,
            }}
          >
            <LinksPage />
          </UserInRoomContext.Provider>
        </Route>
        <div>
          <Navbar/>
        <Route path="/create" exact>
          <UserInRoomContext.Provider
            value={{
              isGameMaster,
              defineMasterRole,
              defineCharacter,
              character,
            }}
          >
            <CreatePage />
          </UserInRoomContext.Provider>
        </Route>
        <Route path="/detail/:id" exact>
          <SettingsPage />
        </Route>
        <Route path="/socket.io/:id" exact></Route>
        <Redirect to="/create" />
        </div>
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
