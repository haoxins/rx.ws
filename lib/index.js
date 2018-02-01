
import { WebSocketSubject } from 'rxjs/observable/dom/WebSocketSubject'
import { Observable, ReplaySubject } from 'rxjs'

export function create(opts = {}) {
  const options = {
    retryDelay: 3000, // ms
    ...opts
  }

  const { url, retryDelay } = options

  const ws = new WebSocketSubject(url)

  const subject = new ReplaySubject()

  subject.send = data => {
    if (typeof data !== 'string') {
      data = JSON.stringify(data)
    }

    subject.socket.send(data)
  }

  ws.retryWhen(errs => {
    return errs
      .mergeMap(err => {
        if (window.navigator.onLine) {
          err.retryMessage = `Retry after ${retryDelay} ms`
          err.retryAction = 'delay'
          subject.error(err)
          return Observable.timer(retryDelay)
        } else {
          err.retryMessage = `Retry util online`
          err.retryAction = 'waiting'
          subject.error(err)
          return Observable.fromEvent(window, 'online').take(1)
        }
      })
    })
    .subscribe(data => {
      console.info(97, data)
      subject.next(data)
    })

  return subject
}
