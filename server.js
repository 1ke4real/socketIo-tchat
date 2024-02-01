const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.set("port", process.env.PORT || 3000);
const sendData = async (message) => {
    try {
        const response = await fetch('http://localhost:3000/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message),
        });

        if (!response.ok) {
            throw new Error('Erreur lors de l\'envoi du message.');
        }

        const data = await response.json();
        console.log('Message envoyé avec succès:', data);
    } catch (error) {
        console.error('Erreur lors de l\'envoi du message:', error);
    }
};

io.on('connection', (socket) => {
    socket.on('chat message', (msg, type, user) => {
        // Si le type est 'sent', marquez le message comme envoyé
        const message = { text: msg, type: type === 'sent' ? 'sent' : 'received' };
        io.emit('chat message', message);
        sendData(message).then(r => r).catch(e => e);
        console.log('message: ' + msg, 'type: ' + type , 'user: ' + user);
    });
});


const server = http.listen(app.get("port"), () => {
    console.log("Server is running on port", server.address().port);
});
