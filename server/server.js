const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/isRealString');
const {Users} = require('./utils/users');
const users = new Users();
const path = require('path');
const express = require('express');
const app = express();

// settings
app.set('port', process.env.PORT || 3000);

// static files
app.use(express.static(path.join(__dirname, '../public')));

// start server
const server = app.listen(app.get('port'), () => {
  console.log('server on port ', app.get('port'));
});

// websockets
const SocketIO = require('socket.io');
const io = SocketIO.listen(server);

// connectuin
io.on('connection', (socket) => {
  console.log('new connection', socket.id);

  // join in chat
  socket.on('join', (params, callback) => {
    if (!isRealString(params.user) || !isRealString(params.room)) return callback('El usuario y el chat deben ser validos');

    socket.join(params.room); // join room
    users.removeUser(socket.id);
    users.addUser(socket.id, params.user, params.room);
    io.to(params.room).emit('updateUsersList', users.getUsersList(params.room));
    socket.emit('newMessage', generateMessage('Admin', `Bienvenido al chat ${params.user}.`)); // send message for my
    socket.broadcast.emit('newMessage', generateMessage('Admin', `El usuario ${params.user} ha ingresado.`)); // send message for all ussers expecept my
    callback();
  });

  // user create message
  socket.on('createMessage', (text, callback) => {
    let user = users.getUser(socket.id);

    if (user && isRealString(text)) {
      io.to(user.room).emit('newMessage', generateMessage(user.name, text)); // send message for all users
    }
    callback();
  });

  // user create message location
  socket.on('createLocationMessage', (data) => {
    let user = users.getUser(socket.id);

    if (user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, data.lat, data.lng)); // sebd nessage for all users
    }
  });

  // usser typing
  socket.on('chat:typing', (data) => {
    socket.broadcast.emit('chat:typing', data); // notify user typing for all users expcept my
  });

  socket.on('disconnect', () => {
    let user = users.removeUser(socket.id);

    io.to(user.room).emit('updateUsersList', users.getUsersList(user.room));
    io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} ha salido del chat.`));
  });
});
