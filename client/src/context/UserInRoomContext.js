import {createContext} from 'react';


export const UserInRoomContext = createContext({
      isGameMaster:false,
      character:{
          charName:''
      }
})