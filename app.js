const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cloudchat');

const Message = mongoose.model(
    'Messages',
    {
        user: String,
        group: String,
        message: String,
        sendAt: Date
    },
    'messages'
);
const rooms = {};
app.set('view engine', 'ejs');
app.set('views', path.resolve(__dirname, 'views'));

app.get('/', function(req, res) {
    res.render('index');
});

app.get('/messages/:groupName', (req, res) => {
    Message.find({ group: req.params.groupName }, (err, messages) => {
        if (err) {
            res.statusCode = 500;
        } else {
            res.send(messages);
        }
    });
});

io.on('connection', socket => {
    socket.on('setUserAndGroup', msg => {
        socket.user = msg.user;
        socket.group = msg.group;
        if (!rooms[socket.group]) {
            rooms[socket.group] = [];
        }
        rooms[socket.group].push({ id: socket.id, name: msg.user });
        socket.join(msg.group);
        socket.emit('confirmAuth', {
            status: 'ok',
            id: socket.id,
            users: rooms[socket.group]
        });
        io
            .to(msg.group)
            .emit('userConnected', { connectedUser: msg.user, id: socket.id });
    });
    socket.on('sendMessage', msg => {
        const message = new Message({
            user: socket.user,
            group: socket.group,
            message: msg.text,
            sendAt: Date.now()
        });
        message.save();
        io.to(socket.group).emit('receiveMessage', {
            user: socket.user,
            id: socket.id,
            message: msg.text
        });
    });
    socket.on('disconnect', () => {
        rooms[socket.group] = rooms[socket.group].filter(
            user => user.id === socket.id && user.name === socket.user
        );
        io
            .to(socket.group)
            .emit('userDisconnected', { user: socket.user, id: socket.id });
    });
});

app.use(express.static(path.resolve(__dirname, 'public')));

http.listen(8000, function() {
    console.log('listening on *:8000');
});
