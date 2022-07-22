// Define socket
let socket = io();

// Function to automatically scroll down when someone sent a new message
function scrollToBottom () {
    //last message the user sent = lastElementChild
    let messages = document.querySelector('#messages').lastElementChild;
    messages.scrollIntoView();
}

// built in event listeners connect and disconnect
// When we listen to events we use .on
socket.on('connect', function () {
    console.log('Connected to server.');

    let searchQuery = window.location.search.substring(1);
    let params = JSON.parse('{"' + decodeURI(searchQuery).replace(/&/g, '","').replace(/\+/g, '').replace(/=/g,'":"') + '"}');

    socket.emit('join', params, function(error) {
        if(error){
            alert(error);
            window.location.href = '/';
        }else {
            console.log('There is no error');
        }
    })
});

socket.on('disconnect', function () {
    console.log('Disconnected from server.');
});

socket.on('updateUsersList', function (users) {
    console.log(users);
    let ul = document.createElement('ul');

    users.forEach(function (user) {
        let li = document.createElement('li');
        li.innerHTML = user;
        ul.appendChild(li);
    });

    let usersList = document.querySelector('#users');
    usersList.innerHTML = "";
    usersList.appendChild(ul);
})

socket.on('newMessage', function (message) {
    console.log('newMessage', message);
    let li = document.createElement('li');
    li.setAttribute('class', 'message');
    li.innerHTML = `<div class="messageTitle">
                        <h4>${message.from} <span>at ${message.createdAt}</span></h4>
                    </div>
                    <div class="messageBody">
                        <p>${message.text}</p>
                    </div>`;

    document.querySelector('ul.chatMessages').appendChild(li);
    scrollToBottom();
});

socket.on('newLocationMessage', function (message) {
    console.log('newLocationMessage', message);
    let li = document.createElement('li');
    li.setAttribute('class', 'message');
    li.innerHTML = `<div class="messageTitle">
                        <h4>${message.from} <span>at ${message.createdAt}</span></h4>
                    </div>
                    <div class="messageBody">
                        <a href="${message.url}" target="_blank">My current location</a>
                    </div>`;

    document.querySelector('ul.chatMessages').appendChild(li);
    scrollToBottom();
});

document.querySelector('#submit-btn').addEventListener('click', function (e){
    // Prevents reload
    e.preventDefault();

    socket.emit('createMessage', {
        text: document.querySelector('input[name="message"]').value
    }, function () {
        document.querySelector('input[name="message"]').value = '';
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
