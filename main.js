import './style.css'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'
import * as dayjs from 'dayjs'
import { io } from 'socket.io-client'

document.querySelector('#app').innerHTML = `
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="${viteLogo}" class="logo" alt="Vite logo" />
    </a>
    <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
      <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
    </a>
    <h1>Hello Vite on ${dayjs().format()}!!</h1>
    <div class="card">
      <button id="counter" type="button"></button>
    </div>
    <p class="read-the-docs">
      Click on the Vite logo to learn more
    </p>

    <input type="color" id="favcolor" name="favcolor" value="#ff0000">
    <button id="btnSendColor">Send it!</button>
    <pre id="log">Steven sent #212121</pre>

  </div>
`

setupCounter(document.querySelector('#counter'))

const socket = io("ws://172.17.103.101:3000")

socket.on("connect", () => {
  console.log(socket.connected); // true
});

socket.on("broadcast", (msg) => {
  console.log(msg)
})

socket.on("broadcastColorUpdate", (msg) => {
  document.querySelector('#log').innerHTML = msg

  const jsonData = JSON.parse(msg)
  document.querySelector('body').style.backgroundColor = jsonData.color
})

socket.on("hello", (msg) => {
  console.log(`You received ${msg}`)
})

socket.emit("howdy", "Guido")

document.querySelector('#btnSendColor').addEventListener("click", () => {
  const jsonData = {
    name: 'Guido',
    color: document.querySelector('#favcolor').value 
  }
  socket.emit("colorUpdate", JSON.stringify(jsonData))
  console.log("trying to send " + JSON.stringify(jsonData))
})