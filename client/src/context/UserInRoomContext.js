import {createContext} from 'react';


export const UserContext = createContext({
    socketId:null,
      userId:null,
      streamId:null,
      userName:'JohnDoe',
      isGameMaster:false,
      character:{
          charName:null
      }
})