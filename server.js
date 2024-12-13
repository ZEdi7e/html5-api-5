const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const app = express();
const server = http.createServer(app);
const io = socketIo(server);
app.use(express.static(__dirname));

io.on('connection', (socket) => {
    console.log('Новое соединение');
    socket.on('message', (msg) => {
        console.log('Сообщение получено:', msg);
        io.emit('message', msg);
    });
});

app.get('/events', (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const interval = setInterval(() => {
        res.write(`data: Новое обновление: ${new Date().toISOString()}\n\n`);
    }, 3000);

    req.on('close', () => {
        clearInterval(interval);
        console.log('Соединение SSE закрыто');
    });
});

server.listen(3000, () => {
    console.log('Сервер запущен на http://localhost:3000');
});