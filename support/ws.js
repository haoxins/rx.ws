
const WebSocketServer = require('ws').Server
const wss = new WebSocketServer({
  port: 3003
})

wss.on('connection', ws => {
  console.info('new connection')

  ws.on('message', message => {
    console.info(message)
  })

  ws.on('close', () => {
    console.info('close')
  })

  ws.on('error', err => {
    console.error(err)
  })

  setInterval(() => {
    if (ws.OPEN) {
      console.info('send message')
      ws.send(JSON.stringify({message: 'ok'}))
    }
  }, 3000)

})

console.info('ws:', '3003')
