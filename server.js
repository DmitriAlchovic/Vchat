
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const {sequelize} = require ('./models');


app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'))


async function start(){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    server.listen(5000);
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
}


app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

// ADD DATA TO DB
//users.create({
  //nickName: 'Test2',
  //email:'testEmail2',
  //password:'TestPassword2',
//})
io.on('connection', socket => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
})
start();

//server.listen(3000)

//app.listen ({port:3000}, async()=>{
  //console.log('Server up on port 3000')
  //await sequelize.authenticate()
  //console.log('Database Connected!')
//})