export interface HistoryFullDataResponse {
  t: number[]
  c: string[]
  o: string[]
  h: string[]
  l: string[]
  v: string[]
  t_rounded: number
  s: string
  nextTime: number
}

export interface HistoryUpdateData {
  t: number
  c: number
  o: number
  h: number
  l: number
  v: number
  t_rounded: number
  s: string
  nextTime: number
}

export interface StreamingData {
  channel_id: string
  update: HistoryUpdateData
  params: { subscriber_id: string }
  nextTime: number
}

export interface ConnectedEvent extends Event {
  app?: {
    version?: string
  }
}
