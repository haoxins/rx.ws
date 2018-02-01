
import { create } from '../lib'

const ws = create({
  url: 'ws://localhost:3003'
})

ws.subscribe(data => {
  console.info('receive:', data)
}, err => {
  console.error(err.retryAction)
  console.error(err.retryMessage)
}, () => {
  console.info('done')
})
