const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set("port", process.env.PORT || 4000);

io.on('connection', (socket) => {
    socket.on('chat message', (msg, type, user) => {
        // Si le type est 'sent', marquez le message comme envoyé
        const message = { text: msg, type: type === 'sent' ? 'sent' : 'received' };
        io.emit('chat message', message);
        console.log('message: ' + msg, 'type: ' + type , 'user: ' + user);
    });
});


const server = http.listen(app.get("port"), () => {
    console.log("Server is running on port", server.address().port);
});
