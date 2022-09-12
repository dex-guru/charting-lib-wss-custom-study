import { FC, useState } from 'react'

import { useComponentDidMount } from '../hooks/useComponentDidMount'
import ws from '../services/WebsocketService'
import { ConnectionType } from '../services/WebsocketService/type'
import { WebSocketClient } from '../services/WebsocketService/websocketService'
import WebsocketServiceContext from '../services/WebsocketService/wsContext'

const WebsocketsWrapper: FC = (props) => {
  const [wsClient, setWsClient] = useState<WebSocketClient | null>(null)
  const [wsClientState, setWsClientState] = useState<ConnectionType>(ConnectionType.CLOSED)
  const [wsJti] = useState<string>()


  useComponentDidMount(() => {
    ws.init(setWsClientState).then(() => {
      setWsClient(ws)
    })
  })

  return (
    <WebsocketServiceContext.Provider value={{ ws: wsClient, wsState: wsClientState, jti: wsJti }}>
      {props.children}
    </WebsocketServiceContext.Provider>
  )
}

export default WebsocketsWrapper
