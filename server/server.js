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


// Connect multiple devices to our server
let counter = 0;


io.on('connection', (socket) => {
    counter++;
    console.log(counter+' someone connected.');

    socket.emit('newMessage', {
        from: "Admin",
        text: "Welcome to the chat!",
        createdAt: new Date().getTime()
    });

    socket.broadcast.emit('newMessage', {
        from: "Admin",
        text: "New user joined!",
        createdAt: new Date().getTime()
    });

    socket.on('createMessage', (message) => {
        console.log("createMessage", message);
        //io, everyone connected, everyone gets this message even itself
        io.emit('newMessage', {
            from: message.from,
            text: message.text,
            // to prevent spoofing
            // Spoofing is a cybercrime that happens when someone impersonates a trusted contact or brand, pretending to be someone you trust in order to access sensitive personal information.
            createdAt: new Date().getTime()
        });

        // broadcast sends an event to everyone, except for the person that created the event
        // socket.broadcast.emit('newMessage', {
        //         from: message.from,
        //         text: message.text,
        //         createdAt: new Date().getTime()
        //     });
    })

    socket.on('disconnect', () => {
        console.log('A user disconnected.');
    });
});