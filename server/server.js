// require express and http
const express = require('express');
const http = require('http');

const {newMessage, newLocationMessage} = require('./utils/message');

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


// Connect multiple devices to our server
let counter = 0;


io.on('connection', (socket) => {
    counter++;
    console.log(counter+' someone connected.');

    socket.emit('newMessage', newMessage('Admin', 'Welcome to the chat!'));

    socket.broadcast.emit('newMessage', newMessage('Admin', 'New user joined!'));

    socket.on('createMessage', (message, callback) => {
        console.log("createMessage", message);
        //io, everyone connected, everyone gets this message even itself
        io.emit('newMessage', newMessage(message.from, message.text));
        callback('This is the server:');

        // broadcast sends an event to everyone, except for the person that created the event
        // socket.broadcast.emit('newMessage', {
        //         from: message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        //     });
    })

    socket.on('createLocationMessage', (coords) => {
        //emit to everybody including ourselves
        io.emit('newLocationMessage', newLocationMessage('Admin', coords.lat, coords.lng))
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});