
const express = require('express');
const app = express();
const config = require('config')
const server = require('http').Server(app);
const io = require('socket.io')(server,{cors:{
  origin: '*'
}});
const { v4: uuidV4 } = require('uuid');
const {sequelize} = require ('./models');


app.use(express.json({extended: true}));
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/link/', require('./routes/link.routes'))




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
io.on('connection', socket => {
  console.log('socket connected')
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    console.log('new user');
    socket.to(roomId).broadcast.emit('user-connected', userId)

    socket.on('disconnect', () => {
      console.log('user disconected');
      socket.to(roomId).broadcast.emit('user-disconnected', userId)
    })
  })
}) 
start();

