import React, {useContext, useEffect, useState, useRef} from 'react';
import {useHttp} from '../hooks/http.hook';
import {AuthContext} from '../context/AuthContext';
import {useHistory} from 'react-router-dom';
import {useMessage} from '../hooks/message.hook';
import { UserInRoomContext } from '../context/UserInRoomContext';



export const CreatePage = () => {
  const history = useHistory();
  const auth = useContext(AuthContext);
  const {isGameMaster,defineRole,character} = useContext(UserInRoomContext);
  const {loading,request, error,clearError} = useHttp();
  const [roomName, setRoom] = useState('');
  const message = useMessage();
  const [roomsList,setRoomsList]=useState('');
  const [charList,setCharList]=useState('');
  const selectRef = useRef(null);
  const tabRef=useRef(null);
  const [gameMaster,setMasterRole]=useState(false);
  const [enterButtonStatus,setEnterButtonStatus]=useState('');
  useEffect(() => {
    message(error)
    clearError()
}, [error, message,clearError])

  useEffect(() => {
    window.M.updateTextFields();
    window.M.AutoInit(); 
    window.M.Tabs.init(tabRef.current);
    window.M.FormSelect.init(selectRef.current);

  })

  useEffect( async() => {
    try {
      const data = await request('/api/char/list', 'POST', {userId:auth.userId}, {
        Authorization: `Bearer ${auth.token}`
      })
      console.log(data);
      const selectCharList = data.charList.map(({charName})=>
      <option key={charName} value={charName}>{charName}</option>
      )
      return(setCharList(selectCharList))
    } catch (e) {}
  },[])
  
  useEffect(()=>{
   defineRole(true) 
    if(gameMaster){
      setEnterButtonStatus('btn yellow darken-4')
    }
    else{setEnterButtonStatus('btn yellow darken-4 disabled')}
  },[gameMaster])

  const pressHandler = async () => {
      try {
        const data = await request('/api/link/generate', 'POST', {roomName: roomName}, {
          Authorization: `Bearer ${auth.token}`

        })
        if(gameMaster){
    console.log(isGameMaster);
        }
        history.push(`/links/${data.room.roomUuid}`)
      } catch (e) {}
  }
 

  const roomsListHandler = async () => {
     try {
      const data = await request('/api/link/list', 'GET', null, {
        Authorization: `Bearer ${auth.token}`
      })
      const badgesList = data.roomsList.map(({roomName})=>
        
      <li key={roomName}>
        <div className="collapsible-header">
          <i className="material-icons">people</i>
          Room name:{roomName}
          <span className="badge">
            Game master:
          <i className="material-icons green-text">person</i>
            players in room: /8</span>
        </div>
        <div className="collapsible-body">
        <label>
          <input onChange={(e)=>{setMasterRole(e.target.checked)}} type="checkbox" />
          <span>Enter as GameMaster</span>
        </label>
        <div className="input-field col s7">
          <select>
            <option value="none" >-none-</option>
            {charList}
          </select>
          <label>Select character</label>
        </div>
        <div>
          <button className = "btn yellow darken-4 disabled" 
          value={roomName}
          disabled={loading}>
          Join room
          </button>
        </div>
      </div>
    </li>
      );
      return(setRoomsList(badgesList))
    } catch (e) {}

}

  return (
    <div className="row">
      <div className="col s6 offset-s3">
        <ul
          ref={tabRef}
          id="tabs-swipe-demo"
          className="tabs blue text-red">
            <li className="tab col s3">
              <a className="text-blue" href="#create">Create room</a>
            </li>
            <li className="tab col s3">
              <a 
              onClick={roomsListHandler} 
              href="#join">
              
              Join room
              <i className="small material-icons waves-effect btn-floating btn-small">refresh</i>
              </a>
            </li>
        </ul>  
        <div id="create">
          <div className="input-field">
            <input
            placeholder="Enter the room name"
            id="room"
            type="text"
            value={roomName}
            onChange={e => setRoom(e.target.value)}
            />
            <label htmlFor="room">Create Rooom</label>
          </div>
          <p>
            <label>
              <input  type="checkbox" onChange={(e)=>{setMasterRole(e.target.checked);}}/>
              <span>Enter as GameMaster</span>
            </label>
          </p>
          <div  className="input-field col s7">
          <select>
            <option value="none" >-none-</option>
            {charList}
          </select>
          <label>Select character</label>
        </div>
          <div>
                <button className = {enterButtonStatus} 
                disabled={loading}
                onClick={pressHandler}
                >
                Create room
                </button>
              </div>
        </div>
      </div>
      <div className="row" id="join">
        <div className="col s6 offset-s3">
          <ul className="collapsible">
            {roomsList}
          </ul>
        </div>
      </div>
    </div>
  )
}
