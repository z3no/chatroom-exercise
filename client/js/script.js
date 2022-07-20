// Define socket
let socket = io();

// built in event listeners connect and disconnect
// When we listen to events we use .on
socket.on('connect', function () {
    console.log('Connected to server.');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
});