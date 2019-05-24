import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000/');

function connect(id){
    // 1 itu uuid yg lagi login
    socket.on(id, ( from_id, message ) => {
        console.log(from_id + " " +message)
    })
}

export { connect, socket }