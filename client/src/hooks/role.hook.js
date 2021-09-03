import {useState, useCallback, useEffect} from 'react';

const storageName = 'roleInRoom';

export const useRole = () => {

  const [isGameMaster, setGameMaster] = useState('false');
  const [character, setCharacter] = useState({ charName: '' });
  const defineRole = useCallback((GameMaster) => {
        setGameMaster(GameMaster);
    
    localStorage.setItem(storageName, JSON.stringify({
      isGameMaster:GameMaster
    }));
  })


  /* const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []) */

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
   if(data) {defineRole(data.isGameMaster);}
  }, [defineRole])


  return { isGameMaster,defineRole,character }
}
