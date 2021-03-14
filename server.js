
const express = require('express');
const app = express();
const config = require('config')
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const {sequelize} = require ('./models');


app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'))

const PORT = config.get('port')|| 5000;

async function start(){
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`))
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

