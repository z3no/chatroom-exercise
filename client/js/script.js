// Define socket
let socket = io.connect();

/*
 ****************
 ***** USER *****
 ****************
 */

//prompt to ask user's name
const username = prompt('Welcome! Please enter a username:');

// emit event to server with the user's name
socket.emit('new-connection', { username });

// captures welcome-message event from the server
socket.on('welcome-message', (data) => {
    console.log('received welcome-message >>', data);
    // adds welcome message
    addMessage(data, false);
});


/*
 ****************************
 ***** SENDING MESSAGES *****
 ****************************
 */


// Buttons
let sendAll = document.getElementById('sendToAll');
let sendSelf = document.getElementById('sendToSelf');


function addMessage(data, isSelf = false) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');

    if (isSelf) {
        messageElement.classList.add('self-message');
        messageElement.innerText = `${data.message}`;
    } else {
        if (data.user === 'server') {
            //message is from the server, for instance a notification that a new user connected
            messageElement.innerText = `${data.message}`;
        } else {
            // message from other user
            messageElement.classList.add('others-message')
            messageElement.innerText = `${data.user}: ${data.message}`;
        }
    }

    // Get chatcontainer element, this is our target where we want our messages
    const target = document.getElementById('chatContainer');

    // add the new div to the target div
    target.append(messageElement);
}

// Send message to all
sendAll.addEventListener('click', function (e){
    // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    e.preventDefault();

    const messageInput = document.getElementById('input');

    if (messageInput.value !== '') {
        let newMessage = messageInput.value;
        //sends message and our id to socket server
        socket.emit('new-message-toAll', {user: socket.id, message: newMessage});
        //append message in chat container, with isSelf flag true
        addMessage({message: newMessage}, true);
        //resets input
        messageInput.value = '';
    } else {
        // add error styling to input
        messageInput.classList.add('error');
    }
});

// Send message to self
sendSelf.addEventListener('click', function (e){
    // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
    e.preventDefault();

    const messageInput = document.getElementById('input');

    if (messageInput.value !== '') {
        let newMessage = messageInput.value;
        //sends message and our id to socket server
        socket.emit('message-only-visible-toSelf', {user: socket.id, message: newMessage});
        //append message in chat container, with isSelf flag true
        addMessage({message: newMessage}, true);
        //resets input
        messageInput.value = '';
    } else {
        // add error styling to input
        messageInput.classList.add('error');
    }
});
/*
sendSelf.addEventListener('click', function (e){
    e.preventDefault();
    if (input.value) {
        socket.emit('sendToSelf', input.value);
        input.value = '';
    }
});
*/

socket.on('broadcast-message', (data) => {
    console.log('📢 broadcast-message event >> ', data);
    //append message in chat container, with itSelf flag false
    addMessage(data, false);
});