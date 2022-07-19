// Define socket
let socket = io.connect();

// Buttons
let sendToAll = document.getElementById('sendToAll');
let sendToSelf = document.getElementById('sendToSelf');

// Target for messages
let target = document.getElementById('target');

// Send message to all
function displayMessageToAll() {
    let message = document.getElementById('message').value;
    socket.emit('sendToAll', (message));
    console.log(message);
}

socket.on('displayMessage', (message) => {
    target.innerHTML += '<br>'+message;
});

sendToAll.addEventListener('click', displayMessageToAll);

// Send message to self
function displayMessageToSelf() {
    let message = document.getElementById('message').value;
    socket.emit('sendToSelf', (message));
    console.log(message);
}

sendToSelf.addEventListener('click', displayMessageToSelf);