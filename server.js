
const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const { v4: uuidV4 } = require('uuid');
const users = require ('./models').users;

app.set('view engine', 'ejs')
app.use(express.static('public'))
//Route for chek
app.get('/Users',(req,res)=>{
  users.findAll().then(fetchedData=>{
    res.json(fetchedData);
  });
});
app.get('/getUser',(req,res)=>{
  res.json('REQUEST WAE SUCCESSFUL');
});

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

// ADD DATA TO DB
//users.create({
  //nickname: 'Test1',
  //email:'testEmail1',
  //password:'TestPassword1',
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

server.listen(3000)