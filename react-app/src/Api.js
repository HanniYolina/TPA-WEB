import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000/');

let receive
function setReceive(rec){
    receive = rec
}

function connect(id){
    // 1 itu uuid yg lagi login
    // console.log(id)
    socket.on(id, ( to_id, message ) => {
        // console.log(message)  
        if(receive){
            receive(message)
        }
    })
}

export { connect, socket, setReceive }