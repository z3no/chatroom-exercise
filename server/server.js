// require express and http
const express = require('express');
const http = require('http');

const {newMessage, newLocationMessage} = require('./utils/message');
const {realString} = require('./utils/realString');
const {Users} = require('./utils/users');

// We will use express and http to host our client
// Define our application
const app = express();
// Give the path to our client
const clientPath = `${__dirname}/../client`;
// Use express to host the client
app.use(express.static(clientPath));
// Use http to serve the app that express provides
const server = http.createServer(app);
let port = 8080;
// Get the server live
server.listen(8080, () => {
    console.log("server running on "+port);
});
// Require socket.io
// The io variable is now the entry point of all the sockets connected to the server
const io = require('socket.io')(server);

let users = new Users();


// Connect multiple devices to our server
let counter = 0;


io.on('connection', (socket) => {
    counter++;
    console.log(counter+' someone connected.');

    socket.on('join', (params, callback) => {
        if(!realString(params.name) || !realString(params.room)){
            return callback('Name and room are required');
        }

        socket.join(params.room);
        //if a user joins a room we remove them from any potential room they might still be in
        users.removeUser(socket.id);
        //add user to new room
        users.addUser(socket.id, params.name, params.room);

        io.to(params.room).emit('updateUsersList', users.getUserList(params.room));
        socket.emit('newMessage', newMessage('Admin', `Welcome to ${params.room}!`));

        socket.broadcast.to(params.room).emit('newMessage', newMessage('Admin', 'New user joined!'));

        callback();
    })

    socket.on('createMessage', (message, callback) => {
        console.log("createMessage", message);
        let user = users.getUser(socket.id);

        if(user && realString(message.text)){
            //io, everyone connected to the specific room gets this message even the person who send it, if we do not specify the room it will be sent to all chat rooms.
            io.to(user.room).emit('newMessage', newMessage(user.name, message.text));
        }
        callback('This is the server:');

        // broadcast sends an event to everyone, except for the person that created the event
        // socket.broadcast.emit('newMessage', {
        //         from: message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        //     });
    })

    socket.on('createLocationMessage', (coords) => {
        let user = users.getUser(socket.id);

        if(user){
            //emit to everybody in a specific room including ourselves
            io.to(user.room).emit('newLocationMessage', newLocationMessage(user.name, coords.lat, coords.lng))
        }
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
        let user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', newMessage('Admin', `${user.name} has left ${user.room} chat room.`));
        }
    });
});