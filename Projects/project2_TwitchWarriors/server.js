var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));
var io = socket(server);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

function newConnection(socket) {

}

//_______________ tmi.js _______________

const tmi = require('tmi.js');

const client = new tmi.Client({
	channels: [ 'bukithat' ]
});

client.connect();

let listeningForCount = false;
let msgCount = 0;
const users = {};

// Message Counter

client.on('message', (channel, tags, message, self) => {
	// "Alca: Hello, World!"
  if(self) return;
  const { username } = tags;

  if (username === 'bukithat' && message === '!start-count') {
    listeningForCount = true;
    console.log('starting the counter');
  } else if (listeningForCount) {
    msgCount ++;
    console.log(`${tags['display-name']}: ${message}` + msgCount);
  }
});

app.post('http://localhost:3000/', async (request, response) => {
    if(listeningForCount && msgCount >= 5) {
      listeningForCount != listeningForCount;
      msgCount = 0;

      console.log("sending response");
      res.send("lootbox");
      res.end();
    }
})



//console.log('My socket server is running');
