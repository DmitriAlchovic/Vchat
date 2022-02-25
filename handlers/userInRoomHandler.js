const UserInRoom = require ('../models').usersInRoom;
const Room = require('../models').rooms



module.exports = (id, mediaStreamId, role,roomId) =>{

    const candidate = Room.findOne({
        where: { 
            roomId:roomId
            
        }
        
    })
    
    if (!candidate) {
       return (console.log('Room exists'));
    }

    const user = UserInRoom.create ({id, mediaStreamId, role,roomId})
} 