import { WebSocketClient } from './websocketService'

const ws = new WebSocketClient('wss://ws.dex.guru/v1/ws/channels')

export default ws
