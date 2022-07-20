// Define socket
let socket = io();

// built in event listeners connect and disconnect
socket.on('connect', () => {
    console.log('Connected to server.');
});

socket.on('disconnect', () => {
    console.log('Disconnected from server.');
});