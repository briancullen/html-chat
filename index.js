// Setup basic express server
var express = require('express');
var app = express();

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var htmlTagValidator = require('html-tag-validator');

var port = process.env.PORT || 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Routing
app.use(express.static(__dirname + '/public'));

// Name of the default room
const roomPrefix = "--";
const defaultRoom = "Default";

// usernames which are currently connected to the chat
// and the room that they are in.
var usernames = {};
var numUsers = 0;

io.on('connection', function (socket) {
  var addedUser = false;
  socket.join(roomPrefix + defaultRoom);
  
  // when the client emits 'new message', this listens and executes
  socket.on('new message', function (data) {
    if (!("username" in socket)) {
      socket.emit("message error", {
        message: "Who are you?",
        error: "You need to logon using <strong>addUSer()</strong>"
      })
      return;
    }
    
    htmlTagValidator(data, function(err, tags) {
      if (err) {
        socket.emit("message error", {
          message: "You're mumbling, talk properly!",
          error: err.message
        });
        return;
      }
      
      for (var tag in tags.document) {
        console.log(JSON.stringify(tags.document[tag].type));
        if (tags.document[tag].type != "element") {
          socket.emit("message error", {
            message: "You must talk in proper HTML",
            error: "All your text must be inside HTML tags."
          });
          return;          
        }
      }
      io.to(socket.rooms[1]).emit
      ('new message', { username: socket.username,
                        message: data
       });
    });
  });

  // when the client emits 'add user', this listens and executes
  socket.on('add user', function (username) {
    if (username in usernames) {
      socket.emit("message error", {
        message: "Are you having an identity crisis?",
        error: "There can only be one " + username + " registered."
      })
    }
    
    // we store the username in the socket session for this client
    socket.username = username;
    
    // add the client's username to the global list
    usernames[username] = socket.rooms[1].slice(roomPrefix.length);
    ++numUsers;
    
    addedUser = true;
    socket.emit('login', {
      username: username,
      numUsers: numUsers
    });
    // echo globally (all clients) that a person has connected
    socket.broadcast.to(socket.rooms[1]).emit('user joined', {
      username: socket.username,
      room: socket.rooms[1].slice(roomPrefix.length)
    });
  });

  socket.on('request room list', function () {
    var roomList = []
    var rooms = io.sockets.adapter.rooms;
    for (var room in rooms) {
      if (room.startsWith(roomPrefix)) {
        roomList.push(room.slice(roomPrefix.length));
      }
    }
    socket.emit('room list', roomList);
  });

  socket.on('request user list', function () {
    socket.emit('user list', usernames);
  });
  
  // Definitely opportunity for abstraction between the
  // next to event handlers - need to come back to this.
  socket.on('leave room', function () {
    if (socket.rooms.length == 2 &&
       socket.rooms[1] != roomPrefix+defaultRoom) {
      oldRoom = socket.rooms[1];
      
      socket.leave(oldRoom);
      socket.broadcast.to(oldRoom).emit("user left",
            { username: socket.username,
              room: oldRoom.slice(roomPrefix.length) });
      
      socket.join(roomPrefix+defaultRoom);
      usernames[socket.username] = defaultRoom;
      socket.broadcast.to(roomPrefix+defaultRoom).emit('user joined',
            { username: socket.username,
              room: defaultRoom });
    }
    socket.emit('left room', defaultRoom);
  });

  socket.on('join room', function (roomName) {
    if (socket.rooms.length == 2 &&
       socket.rooms[1] != roomPrefix+roomName) {
      oldRoom = socket.rooms[1];
      
      socket.leave(oldRoom);
      socket.broadcast.to(oldRoom).emit("user left",
            { username: socket.username,
              room: oldRoom.slice(roomPrefix.length) });
      
      socket.join(roomPrefix+roomName);
      usernames[socket.username] = roomName;
      socket.broadcast.to(roomPrefix+roomName).emit('user joined',
            { username: socket.username,
              room: roomName });
    }
    socket.emit('joined room', roomName);
  });

  // when the user disconnects.. perform this
  socket.on('disconnect', function () {
    // remove the username from global usernames list
    if (addedUser) {
      delete usernames[socket.username];
      --numUsers;
      
      // echo globally that this client has left
      socket.broadcast.emit('user disconnected', {
        username: socket.username,
        numUsers: numUsers
      });
    }
  });
});