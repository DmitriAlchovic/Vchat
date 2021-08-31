import React, {useContext, useEffect, useState, useRef} from 'react';
import { AuthContext } from '../context/AuthContext';
import { UserContext } from '../context/UserInRoomContext';
import { useHttp } from '../hooks/http.hook';
import {useMessage} from '../hooks/message.hook';


export const AuthPage = () => {
    const auth = useContext(AuthContext);
    const user = useContext(UserContext);
    const message = useMessage();
    const tabRef = useRef(null);
    const {loading, request, error,clearError} = useHttp();
    const [form, setForm] = useState({
        nickname:'', email: '', password: '', 
    });

    useEffect(() => {
        message(error)
        clearError()
    }, [error, message,clearError])

    useEffect(()=>{
        window.M.updateTextFields()
        window.M.Tabs.init(tabRef.current);
    })

    const changeHandler = event => {
        setForm({ ...form,[event.target.name]: event.target.value})
    }

    const registerHandler = async() =>{
        try{
            
            const data = await request('/api/auth/register','POST', {...form})
            message(data.message)
            
        } catch(e){}
    }

    const loginHandler = async() =>{
        try{
            
            const data = await request('/api/auth/login','POST', {...form})
            auth.login(data.token, data.userId)
            
        } catch(e){}
        
    }
    return (
        <div className="row">
            <div className="col s6 offset-s3">
                <h1>Roleplay Video Chat</h1>
                <div className="card #546e7a blue grey darken-1">
                    <ul
                    ref={tabRef}
                    id="tabs-swipe-demo"
                    className="tabs blue text-red"
                     >
                        <li className="tab col s3">
                            <a className="text-blue" href="#autorization">Autorization</a>
                        </li>
                        <li className="tab col s3">
                            <a href="#registration">Registration</a>
                        </li>
                    </ul>  

                    <div id="autorization" className="card-content white-text">
                        <span className="card-title">Autorization</span>
                        <div>

                            <div className="input-field ">
                                <input 
                                placeholder="Enter email" 
                                id="email" 
                                type="text" 
                                name="email"
                                className="blue-input"
                                value={form.email}
                                onChange={changeHandler}
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field ">
                                <input 
                                placeholder="Enter password" 
                                id="password" 
                                type="password" 
                                name="password"
                                className="blue-input"
                                value={form.password}
                                onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>

                        <div className="card-action">
                        <button className = "btn yellow darken-4" 
                        style={{margin: 10}}
                        onClick={loginHandler}
                        disabled={loading}>
                        Enter
                        </button>
                        </div>
                    </div>

                    <div id="registration" className="card-content white-text">
                        <span className="card-title">Registration</span>
                        <div>

                            <div className="input-field ">
                                <input 
                                placeholder="Enter email" 
                                id="email" 
                                type="text" 
                                name="email"
                                className="blue-input"
                                value={form.email}
                                onChange={changeHandler}
                                />
                                <label htmlFor="email">Email</label>
                            </div>

                            <div className="input-field ">
                                <input 
                                placeholder="Enter password" 
                                id="password" 
                                type="password" 
                                name="password"
                                className="blue-input"
                                value={form.password}
                                onChange={changeHandler}
                                />
                                <label htmlFor="password">Password</label>
                            </div>

                            <div className="input-field ">
                                <input 
                                placeholder="Enter nickname" 
                                id="nickname" 
                                type="text" 
                                name="nickname"
                                className="blue-input"
                                value={form.nickname}
                                onChange={changeHandler}
                                />
                                <label htmlFor="nickname">Nickname</label>
                            </div>
                        </div>

                        <div className="card-action">
                            <button className = "btn grey lighten-1 black-text"
                            onClick={registerHandler}
                            disabled={loading}>
                            Register
                            </button>
                        </div>
                    </div>   
                </div>
            </div>
        </div>
    )
}