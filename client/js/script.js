// Define socket
let socket = io.connect();

// Buttons
let sendAll = document.getElementById('sendToAll');
let sendSelf = document.getElementById('sendToSelf');

// Input
let input = document.getElementById('input');

// Target for messages
let target = document.getElementById('messages');

// Send message to all
sendAll.addEventListener('click', function (e){
    // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    e.preventDefault();
    if (input.value) {
        socket.emit('sendToAll', input.value);
        input.value = '';
    }
});

// Send message to self
sendSelf.addEventListener('click', function (e){
    e.preventDefault();
    if (input.value) {
        socket.emit('sendToSelf', input.value);
        input.value = '';
    }
});

socket.on('chat message', function (message) {
    let item = document.createElement('li');
    item.textContent = message;
    target.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
});