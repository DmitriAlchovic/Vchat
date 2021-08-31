
const express = require('express');
const app = express();
const config = require('config')
const server = require('http').Server(app);
const io = require('socket.io')(server,{cors:{
  origin: '*'
}});
const { v4: uuidV4 } = require('uuid');
const {sequelize} = require ('./models');
const userInRoomHandler = require ('./handlers/userInRoomHandler');


app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/link', require('./routes/link.routes'));
app.use('/api/char', require('./routes/char.routes'));


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

/* 
app.get('/join', (req, res) => {
  res.send({ link: uuidV4() });
});
 */


/* app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

*/
const someUser = {
  userId:'123',
  streamId:'456',
  gameMaster: false, 
roomId:'6ebd39c7-3ba5-4a15-81e'}
let position = 0;
io.on('connection', (socket) => { 
  console.log('connection');
  console.log('socket id',socket.id);
  console.log(socket.request._query['data']);
  console.log('users in room ', position );
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId, userId);
    console.log('new user roomId',roomId, userId);
    socket.to(roomId).broadcast.emit('user-connected', userId);
    socket.on('user-info', (user) => {
      //send message to the same room
      io.to(roomId).emit('send-user-info', user)
  }); 
    
  socket.on('send-my-info', (user,newUser) => {
    //send message to the same room
    console.log('newUser',newUser);
    io.to(newUser).emit('recive-info', user)
});

    socket.on('disconnect', () => {
      console.log('disconect: ',socket.id);
      --position;
      console.log('disconnect. in room ', position);
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
}) 
start();

