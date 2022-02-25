import { useState, useCallback, useEffect } from "react";
import { useHttp } from "../hooks/http.hook";
import { useMessage } from "../hooks/message.hook";

const storageName = "userData";

export const useAuth = () => {
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userName,setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const {  request, error, clearError } = useHttp();
  const message = useMessage();

  useEffect(() => {
    message(error);
    clearError();
  }, [error, message, clearError]);

  const login = useCallback((jwtToken, id) => {
    setToken(jwtToken);
    setUserId(id);
    localStorage.setItem(
      storageName,
      JSON.stringify({
        userId: id,
        token: jwtToken,
      })
    );
  });

  const logout = useCallback(() => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem(storageName);
  }, []);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName));
    if (data && data.token) {
      login(data.token, data.userId);
    }
    setReady(true);
  }, [login]);

  useEffect( async () => {
       const {userId} = JSON.parse(localStorage.getItem(storageName));
      try {
        const data = await request("/api/auth/info", "POST",  {userId:userId} );
       setUserName(data.user.nickname);
       setUserEmail(data.user.email);
      } catch (e) {}
    
  },[userName]);

  return { login, logout, token, userId, ready, userName, userEmail };
};
