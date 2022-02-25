import { useState, useCallback, useEffect } from "react";

const storageName = "roleInRoom";

export const useRole = () => {
  const [isGameMaster, setGameMaster] = useState(false);
  const [character, setCharacter] = useState({ charId: null, charName: null });

  const defineMasterRole = useCallback((GameMaster) => {
    setGameMaster(GameMaster);

    localStorage.setItem(
      storageName,
      JSON.stringify({
        isGameMaster: GameMaster,
      })
    );
  });

  const defineCharacter = useCallback((id, name) => {
    setCharacter({ ...character, charId: id, charName: name });
    localStorage.setItem(
      storageName,
      JSON.stringify({
        character: { charId: id, charName: name },
      })
    );
  });

    useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
    if (data && data.isGameMaster) {
      defineMasterRole(data.isGameMaster);
    }
    else if (data && data.character.charId && data.character.charName){
      defineCharacter(data.charId, data.charName);
    }

  }, []);

  return { isGameMaster, defineMasterRole, defineCharacter, character };
};
