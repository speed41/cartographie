
const express = require('express');
var app = express();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

var bodyParser = require('body-parser');
//var formidable = require('formidable');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' })); // support encoded bodies

io.on('connection', function(socket){
    console.log('Un utilisateur est connecté');
    socket.on('disconnect', function(){
      console.log('Utilisateur déconnecté');
    });
    socket.on('cartographie', function(msg){
      lectureMessage(msg);
      io.emit('cartographie', msg);      
      //console.log('message: ' + msg);
    });
});

io.on('connection', function(socket){
  socket.on('image', function(image) {
            //              fs.readFile(__dirname + '/images/image.jpg', function(err, buf){
            //                socket.emit('image', { image: true, buffer: buf });
            //                console.log('image file is initialized');
  });
});


  
app.use('/', require('./routes').routeprincipale);

app.use('/static', express.static(__dirname + '/public'));

http.listen(2020, function(){
  console.log('listening on *:2020');
});


var joueursPresents ="";

function lectureMessage(msg){
  var objMsg = JSON.parse(msg);
  switch (objMsg.type) {
      case "joueur": 
      // les joueurs en presence se manifestent
      joueursPresents = joueursPresents + " " + objMsg.joueur;

    console.log(joueursPresents);
      break;
      case "jeu": 
      
      break;
      default: break;
  }
}

