import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:5000/');

let receive
function setReceive(rec){
    receive = rec
}

let notified
function setNotified(notif){
    notified = notif
}

function connect(id){
    // 1 itu uuid yg lagi login
    console.log(id)
    socket.on(id, ( to_id, message ) => {
        if(receive){
            receive(message)
        }
    })

    socket.on("notif"+id, ( message ) => {
        if(notified){
            console.log(message)
            notified(message)
        }
    })
}

export { connect, socket, setReceive, setNotified }