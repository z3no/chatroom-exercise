# OCR || The Original ChatRoom
Learning challenge

Back to the good old days, one of the things I grew up with on the internet, CHATROOMS!!
In our new challenge we will be creating a chatroom. Fun, fun, fun. Let's take a look at what we have to do.

## Learning objectives

- Setting up a node environment
- Making a connection between different clients and the server(s)
- Work with sockets
- Configure express and socket.io for node
- Make a basic chatroom

## The Missioné

Let's take a look at these steps we have to follow to make our chatroom:

### TO DO
1. In the root of the project make a `server` and a `client` folder
  - [x] `Server`
    - [x] Make `server.js` file
  - [x] `Client`
    - [x] An `html` file, I'm just going to call it `index.html`
    - [x] An `scss` folder and a `css`folder
    - [x] In my `scss` folder I created a file named `styles.scss`, in my terminal I will run the following command in my `client` folder
    - ```
        sass --watch scss:css
      ```
      Sass will be watching my scss directory where my source files are and re-compile them to css each time I save something in my scss file.
    - [x] A `js` folder
    - [x] with a js file called `script.js`

2. In the `server` folder, do the `npm init` command
   - [x] Run `npm init`
   - Generates a `package.json` file with information about our project and it's dependencies.

3. We are going to install `express`
   - [x] Run `npm install express --save`
   - It's in our `package.json` file! 
   - ```
     "dependencies": {
          "express": "^4.18.1"
     }
     ```

4. In `server.js`
   - [x] require express, `const express = require('express');`
   - [x] require http, `const http = require('http');`

5. Use express and http to make it easy to host our `client`
   - [x] To define our application, `const app = express();`
   - [x] To give the path to our client, <code>const clientPath = \`${__dirname}/../client\`;</code>
   - [x] To use express to host the client, `app.use(express.static(clientPath));`
   - [x] To use http to serve the app that express provides, `const server = http.createServer(app);`
   - [x] One last step to get the server LIVE
     - ```javascript
       let port = 8080;
       // Get the server live
       server.listen(8080, () => {
       console.log("server running on "+port);
       });
       ```
   - [x] In our IDEs terminal while in `server.js` we type in `node server` and check our server out on localhost:8080

6. Get `socket.io` installed
   - [x] In our terminal run, `npm install socket.io --save`
   - It is now in our package.json dependencies
   - ```
     "dependencies": {
        "express": "^4.18.1",
        "socket.io": "^4.5.1"
     }
     ```

7. Set it up in the server
   - [x] To require `socket.io`, `const io = require('socket.io')(server);`
   - Our variable `io` is now the entry point of all the sockets connected to the server

8. The server is now ready to use `socket.io`, but for the client we still need to add the connection to `socket.io`
   - [x] We will add the following, `<script src="/socket.io/socket.io.js"></script>` above our other script in our `index.html`
   - [x] In our `script.js` we add `let socket = io.connect();`

9. We can now start making a connection form our client to the server
   - [x] In `server.js` add the following code:
     ```js
       io.on('connection', (socket) => {
           console.log('someone connected');
       })
     ```
   - If we open up our blank page at localhost:8080 we see that nothing much is happening. But if you go and take a look at your terminal that is running your server, you will see that someone is connected.

10. At this point we can connect with multiple devices to the server, let's try adding a bit of code to verify.
    - [x] Make a counter in our `server.js` file, `let counter = 0`
    - [x] Change our console.log in the connection to, `console.log(counter+' someone connected');`
    - [x] Make the counter go up by 1 every time someone connects
      - ```js
        io.on('connection', (socket) => {
            counter++;
            console.log(counter+' someone connected');
        });
        ```
    
11. Let's make something happen:
    - [x] Add an input field, that will contain your message
    - Add 2 buttons
      - [x] 1 that sends the message to all connected clients
      - [x] 1 that sends the message to yourself only
    - [x] Add a target div where all messages will be displayed

12. On click of a button, emit to the server. The server will receive this and react appropriately after we give the server the instructions of what to do on 'click'.
  - [x] Check
  - ```js
    sendAll.addEventListener('click', function (e){
      // The preventDefault() method cancels the event if it is cancelable, meaning that the default action that belongs to the event will not occur.
      e.preventDefault();
      if (input.value) {
          socket.emit('sendToAll', input.value);
          input.value = '';
      }
    });
    ```
  
13. In the connection function of our server, we add the following:
    - ```js
      socket.on('sendToAll', (message) => {
        io.emit('chat message', (message));
      });
      ```
    - This is an observer that waits until the message 'sendToAll' gets passed to the server.
    - When we press the button on the client side, because of our emit on the client side, the server will receive the 'sendToAll' call and execute the piece of code within the server.
    - The `io.emit` on the server means that the server will now send the call to 'chat message' to ALL the clients connected and also passes the message back as a parameter.

14. We have now sent the message from the client to the server, now we just need to receive it back from the server
    - [x] On the `client` side, add:
    - ```js
      socket.on('chat message', function (message) {
        let item = document.createElement('li');
        item.textContent = message;
        target.appendChild(item);
        window.scrollTo(0, document.body.scrollHeight);
      });
      ```
    - Now our client is waiting for the call 'chat message' and then it will add that message to our target.
    - 