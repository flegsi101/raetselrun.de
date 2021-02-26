const socket = io()

let timerRunning = false
let timer

const zeroPad = (num, places) => String(num).padStart(places, "0");

socket.on("timerSync", (val) => {
    timer = val + 1
    if (!timerRunning) {
        setTimer()
    }
});

socket.on("keyValidation", correct => {
    if (!correct) {
        log.innerHTML = "Der Schlüssel ist falsch :P"
    } else {
        document.location.reload()
    }
});

socket.on('failed', () => {
    console.log('failed')
    document.location.reload()
});

const form = document.getElementById("key-form");
const log = document.getElementById("log");

form.addEventListener("submit", logSubmit);

function setTimer() {
    timerRunning = true
    timer--

    if (timer >= 0) {
        let minutes = Math.floor(timer / 60)
        let seconds = timer - minutes * 60
        document.getElementById("timer").innerHTML = zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2)
        setTimeout(setTimer, 1000)
    }
}

function logSubmit(event) {
    event.preventDefault()
    socket.emit('submitKey', event.target.key.value)
    console.log('submited')
}
