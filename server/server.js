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

// Save the list of users as id:username
let users = {};

io.on('connection', (socket) => {
    counter++;
    console.log(counter+' someone connected');
    console.log('👾 New socket connected! >>', socket.id);
    /*
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
    */

    // handle the new user connection
    socket.on('new-connection', (data) => {
        // captures event when new clients join
        console.log(`new-connection event received`, data);
        // add user to list
        users[socket.id] = data.username;
        console.log('users :>> ', users);
        // emit welcome message event
        socket.emit('welcome-message', {
            user: 'server',
            message: `Welcome to this OG chatroom ${data.username}. There are currently ${Object.keys(users).length} users connected.`,
        })
    })

    // handle message posted by client, visible to all users
    socket.on('new-message-toAll', (data) => {
        console.log(`👾 new-message-toAll from ${data.user}`);
        // broadcast message to all sockets except the one that triggered the event
        socket.broadcast.emit('broadcast-message', {
            user: users[data.user],
            message: data.message,
        })
    });

    // Sending a message only readable for yourself
    socket.on('message-only-visible-toSelf', (data) => {
        console.log(`👾 message-only-visible-toSelf from ${data.user}`);
        // broadcast message to all sockets except the one that triggered the event
        socket.emit('broadcast-message', {
            user: users[data.user],
            message: data.message,
        })
    });
});