import {
  Bar,
  LibrarySymbolInfo,
  ResolutionString,
  SubscribeBarsCallback,
} from '../charting_library/datafeed-api'
import {
  barMapper,
  buildChannelKey,
  setHighLowCandleValue,
} from '../components/TVChartContainer/datafeed/helper'
import ws from './WebsocketService'
import {
  ConnectionHandler,
  StreamingData,
  SubscribeItemType,
  SubscriptionItem,
} from './WebsocketService/type'

export const updateBars = (
  data: unknown,
  subscriptionItem?: SubscriptionItem,
  handler?: ConnectionHandler
): Bar | undefined => {
  if (!subscriptionItem || !handler || !handler?.params) {
    return
  }

  const { update } = data as StreamingData
  const params = subscriptionItem.params as { lastCandleTime: number }
  const handlerParams = handler.params as { lastBar: Bar }

  // check with last bar and not update if older
  if (update.t_rounded < params.lastCandleTime) {
    return
  }
  // update last saved candle
  params.lastCandleTime = update.t_rounded

  try {
    let bar = barMapper(update)
    if (handlerParams.lastBar.time !== bar.time) {
      bar = setHighLowCandleValue(handlerParams.lastBar, bar)
    }
    handlerParams.lastBar = bar
    return bar
  } catch (err) {
    console.error('[tvdf: update] error: ', err)
  }
}

export const wsTVChartService = {
  subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscriberId: string,
    chartId: string,
    lastCandleTimestamp?: number
  ): void {
    if (!symbolInfo.ticker) {
      return
    }

    const channelId = buildChannelKey(symbolInfo.ticker, resolution) || ''

    const onMessageHandler = (
      data: unknown,
      subscriptionItem?: SubscriptionItem,
      handler?: ConnectionHandler
    ): void => {
      const bar = updateBars(data, subscriptionItem, handler)
      bar && onRealtimeCallback(bar)
    }

    const handler = {
      uuid: `${subscriberId}-${chartId}`,
      reconnect: false,
      onMessage: onMessageHandler,
      params: { lastBar: lastCandleTimestamp },
    }

    ws.subscribe(channelId, SubscribeItemType.chart, {}, handler)
  },

  unsubscribeBars(subscriberId: string, chartId: string): void {
    ws.unsubscribe(`${subscriberId}-${chartId}`)
  },
}
