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
    li.innerText = `${message.from} ${message.createdAt}: ${message.text}`;

    document.querySelector('body').appendChild(li);
});

socket.on('newLocationMessage', function (message) {
    console.log('newLocationMessage', message);
    let li = document.createElement('li');
    let a = document.createElement('a');
    //opens another tab
    a.setAttribute('target', '_blank');
    a.setAttribute('href', message.url);
    a.innerText = 'My current location';
    li.appendChild(a);

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

document.querySelector('#sendLocation').addEventListener('click', function (e){
    //check if the browser has geolocation
    if(!navigator.geolocation) {
        return alert('Geolocation is not supported by your browser.');
    }

    //grab current location
    navigator.geolocation.getCurrentPosition( function (position)
    {
        // console.log(position);
        socket.emit('createLocationMessage', {
            //latitude data
            lat: position.coords.latitude,
            //longitude data
            lng: position.coords.longitude

        })
    }, function () {
        alert('Unable to fetch location.')
    })
});
