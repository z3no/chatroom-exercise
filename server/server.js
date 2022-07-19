// require express and http
const express = require('express');
const http = require('http');

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

// Making a connection from our client to our server
/*
io.on('connection', (socket) => {
    console.log('someone connected');
});
*/

// Connect multiple devices to our server
let counter = 0;

io.on('connection', (socket) => {
    counter++;
    console.log(counter+' someone connected');
    /*
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    */
    // Sending the message to everyone, including the sender
    socket.on('sendToAll', (message) => {
        io.emit('chat message', (message));
    });

    // Sending a message readable for yourself
    socket.on('sendToSelf', (message) => {
        // socket.emit will only send the message back to the socket of which it received the message
        socket.emit('chat message', (message));
    })
});