const path = require('path');
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const { dirname } = require('path');


const app = express();
const server = http.createServer(app);
const io = socketio(server)


const router = express.Router()


app.use(express.static(path.join(__dirname, 'public')));


app.use(express.urlencoded({
    extended: true
}))

failed = false;
currentClue = 0;
keys = [
    "losgehts",
    "124",
    "937",
    "876",
    "27",
    "kreuz9",
    "16tausend",
    "21",
    "13",
    "42313"
];


let timer;



app.get('/', (req, res) => {
    if (failed) {
        res.sendFile(path.join(__dirname, `html/failed.html`))
    } else if (currentClue == 10) {
        res.sendFile(path.join(__dirname, `html/success.html`))
    } else if (req.socket.remoteAddress == '::ffff:84.119.122.174') {
        res.sendFile(path.join(__dirname, `html/clue${currentClue}_form.html`))
    } else {
        res.sendFile(path.join(__dirname, `html/clue${currentClue}.html`))
    }
});


io.on('connection', socket => {
    socket.on('submitKey', key => {
        if (key == keys[currentClue]) {
            if (currentClue == 0) {
                startTimer()
            }
            currentClue++;
            io.emit('keyValidation', true)
        } else {
            io.emit('keyValidation', false)
        }
    });

    if (currentClue > 0) {
        socket.emit('timerSync', timer)
    }
});


server.listen(80);

function startTimer() {
    timer = 90 * 60;
    time();
}

function time() {
    timer--;
    if (timer % 10 == 0) {
        io.emit('timerSync', timer);
    }

    if (timer > 0) {
        setTimeout(time, 1000);
    } else {
        if (currentClue < 10) {
            failed = true;
            io.emit('failed', '')
        }
    }
}