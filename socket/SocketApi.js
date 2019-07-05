var socket_io = require('socket.io');
var io = socket_io();
var socketApi = {};

socketApi.io = io;

io.on('connection', function(socket){
    console.log("New connection");
    // io.emit('chat', 'hello my friend')

    socket.on('newMessage', function(to_id, from_id, message){
        console.log(from_id, to_id,message)
        io.emit(to_id, from_id, message)
    })
});

module.exports = socketApi;