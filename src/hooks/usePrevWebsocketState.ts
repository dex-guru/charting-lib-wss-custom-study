import { useContext, useEffect, useRef } from 'react'

import { ConnectionType } from '../services/WebsocketService/type'
import websocketServiceContext from '../services/WebsocketService/wsContext'

export function usePrevWebsocketState(cb: () => void): void {
  const { ws, wsState } = useContext(websocketServiceContext)
  const prevWsState = useRef('')

  useEffect(() => {
    if (wsState === ConnectionType.ERROR) {
      prevWsState.current = ConnectionType.ERROR
    }
    if (wsState === ConnectionType.READY && prevWsState.current === ConnectionType.ERROR) {
      cb()
      prevWsState.current = ''
    }
  }, [cb, ws, wsState])
}
