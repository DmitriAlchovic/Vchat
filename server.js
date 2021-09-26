
const express = require('express');
const app = express();
const config = require('config')
const server = require('http').Server(app);
const io = require('socket.io')(server,{cors:{
  origin: '*'
}});
const {sequelize} = require ('./models');
const userInRoomHandler = require ('./handlers/userInRoomHandler');
const fileUpload = require('express-fileupload');


app.use(express.json({extended: true}));
app.use(fileUpload({}))
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/api/char', require('./routes/char.routes'));
app.use('/api/friend', require('./routes/friend.routes'));


const PORT = config.get('port')|| 5000;

async function start(){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    server.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}



io.on('connection', (socket) => { 

  console.log('connection');
  console.log('socket id',socket.id);
  console.log(socket.request._query['data']);
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId, userId);
    console.log('new user roomId',roomId, userId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
    socket.on('user-info', (user) => {
      //send message to the same room
      io.to(roomId).emit('send-user-info', user)
  }); 
  let lastSender = null;
  socket.on('send-my-info', (sender,user,newUser) => {
    //send message to the same room
    console.log('newUser',newUser,sender,'=>sender',lastSender,'last');

    if(lastSender!=sender){
    io.to(newUser).emit('recive-info', user)
    }
    lastSender=sender;
});

    socket.on('disconnect', () => {
      console.log('disconect: ',socket.id);
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
}) 
start();

