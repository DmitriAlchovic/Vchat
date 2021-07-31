import React, {useContext, useEffect, useState} from 'react'
import {useHttp} from '../hooks/http.hook'
import {AuthContext} from '../context/AuthContext'
import {useHistory} from 'react-router-dom'
import {useMessage} from '../hooks/message.hook';


export const CreatePage = () => {
  const history = useHistory()
  const auth = useContext(AuthContext)
  const {request, error,clearError} = useHttp()
  const [roomName, setLink] = useState('')
  const message = useMessage()

  useEffect(() => {
    message(error)
    clearError()
}, [error, message,clearError])

  useEffect(() => {
    window.M.updateTextFields()
  }, [])

  const pressHandler = async event => {
    if (event.key === 'Enter') {
      try {
        const data = await request('/api/link/generate', 'POST', {roomName: roomName}, {
          Authorization: `Bearer ${auth.token}`
        })
        console.log(data.roomName)
        history.push(`/links/${123}`)
      } catch (e) {}
    }
  }

  return (
    <div className="row">
      <div className="col s8 offset-s2" style={{paddingTop: '2rem'}}>
        <div className="input-field">
          <input
            placeholder="Enter the room name"
            id="link"
            type="text"
            value={roomName}
            onChange={e => setLink(e.target.value)}
            onKeyPress={pressHandler}
          />
          <label htmlFor="link">Create Rooom</label>
        </div>
      </div>
    </div>
  )
}
