import axios from 'axios'

import { PeriodParamsWithOptionalCountback } from '../../../../public/datafeeds/udf/src/history-provider'
import { IBasicDataFeed, SearchSymbolResultItem } from '../../../charting_library'
import {
  Bar,
  DatafeedConfiguration,
  ErrorCallback,
  HistoryCallback,
  HistoryMetadata,
  LibrarySymbolInfo,
  OnReadyCallback,
  ResolutionString,
  ResolveCallback,
  SearchSymbolsCallback,
  SubscribeBarsCallback,
} from '../../../charting_library/datafeed-api'
import { wsTVChartService } from '../../../services/wsTVChartService'
import { log } from './helper'

const supportedResolutions: ResolutionString[] = [
  '5',
  '10',
  '30',
  '60',
  '240',
  'D',
] as ResolutionString[]

let _lastCandleTimestamp = 0

const config: DatafeedConfiguration = {
  supported_resolutions: supportedResolutions,
}

const datafeed = {
  chartId: '',
  subscriberId: '',
  lastBar: {},
  searchSymbols: (
    userInput: string,
    exchange: string,
    symbolType: string,
    onResult: SearchSymbolsCallback
  ): void => {
    // used for "Compare" feature
    log('[tvdf: search symbols]')
    axios
      .get(
        `https://api.dex.guru/v1/tradingview/search?query=${userInput.toUpperCase()}&limit=30&type=${symbolType}&exchange=${exchange}`
      )
      .then((response) => {
        const symbols = response.data as SearchSymbolResultItem[]
        onResult(symbols || [])
      })
      .catch((e: Error) => {
        console.error(e)
        onResult([])
      })
  },
  onReady: function onReady(cb: OnReadyCallback): void {
    log('[tvdf: onReady]: executed')
    setTimeout(() => cb(config), 0) // resolves warning: `onReady` should return result asynchronously. Use `setTimeout` with 0 interval to execute the callback function.
  },
  resolveSymbol: (symbolName: string, onResolve: ResolveCallback, onError: ErrorCallback): void => {
    axios
      .get(`https://api.dex.guru/v1/tradingview/symbols?symbol=${symbolName}`)
      .then((response) => {
        if (!response.data) {
          return
        }

        setTimeout(() => onResolve(response.data), 0)
      })
      .catch((error) => onError(error))
  },
  getBars: async function getBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    periodParams: PeriodParamsWithOptionalCountback,
    onHistoryCallback: HistoryCallback,
    onErrorCallback: ErrorCallback
  ): Promise<void> {
    const { from, to } = periodParams
    log('[tvdf: getBars]: Method called', symbolInfo, resolution, from, to)

    try {
      const { data } = await axios.get(
        `https://api.dex.guru/v1/tradingview/history?symbol=${symbolInfo.ticker}&resolution=${resolution}&from=${from}&to=${to}`
      )

      const bars: Bar[] = []
      const meta: HistoryMetadata = {
        noData: false,
      }

      if (!data || data.s !== 'ok') {
        meta.noData = true
        meta.nextTime = data?.nextTime
      } else {
        // save last candle to cache
        _lastCandleTimestamp = data.t[data.t.length - 1]

        const volumePresent = data.v !== undefined
        const ohlPresent = data.o !== undefined

        for (let i = 0; i < data.t.length; ++i) {
          const barValue: Bar = {
            time: data.t[i] * 1000,
            close: parseFloat(data.c[i]),
            open: parseFloat(data.c[i]),
            high: parseFloat(data.c[i]),
            low: parseFloat(data.c[i]),
          }

          if (ohlPresent) {
            barValue.open = parseFloat(data.o[i])
            barValue.high = parseFloat(data.h[i])
            barValue.low = parseFloat(data.l[i])
          }

          if (volumePresent) {
            barValue.volume = parseFloat(data.v[i])
          }

          bars.push(barValue)
        }
      }

      this.lastBar = bars[bars.length - 1]
      onHistoryCallback(bars, meta)
    } catch (error) {
      console.error('[tvdf: getBars]: Get error', error)
      onErrorCallback('Failed to update bar')
    }
  },
  subscribeBars: function subscribeBars(
    symbolInfo: LibrarySymbolInfo,
    resolution: ResolutionString,
    onRealtimeCallback: SubscribeBarsCallback,
    subscriberId: string
  ): void {
    this.subscriberId = subscriberId
    wsTVChartService.subscribeBars(
      symbolInfo,
      resolution,
      onRealtimeCallback,
      subscriberId,
      this.chartId,
      _lastCandleTimestamp
    )
  },
  unsubscribeBars: function unsubscribeBars(subscriberId: string): void {
    wsTVChartService.unsubscribeBars(subscriberId, this.chartId)
  },
}

const DataFeed = (id: string): IBasicDataFeed => {
  datafeed.subscriberId = ''
  datafeed.chartId = id
  datafeed.subscribeBars = datafeed.subscribeBars.bind(datafeed)
  datafeed.unsubscribeBars = datafeed.unsubscribeBars.bind(datafeed)
  return datafeed
}

export default DataFeed
