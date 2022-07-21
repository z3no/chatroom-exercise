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
    let li = document.createElement('li');
    li.innerText = `${message.from}: ${message.text}`;

    document.querySelector('body').appendChild(li);
});

document.querySelector('#submit-btn').addEventListener('click', function (e){
    // Prevents reload
    e.preventDefault();

    socket.emit('createMessage', {
        from: 'User',
        text: document.querySelector('input[name="message"]').value
    }, function () {

    })
})