import { Bar } from '../../../charting_library'
import { HistoryUpdateData } from './type'

export const isWebsocketFeatureEnabled = process.env.REACT_APP_TV_WEBSOCKETS === 'true'

export const log = (...args: unknown[]): void => {
  if (process.env.REACT_APP_TV_CHART_DEBUG === 'true') {
    // eslint-disable-next-line no-console
    console.log(...args)
  }
}

export const buildChannelKey = (ticker: string, resolution: string): string | undefined => {
  try {
    const interval = parseInt(resolution, 10) * 60
    const [tokenAddress, apendix] = ticker.split('-')
    const [network, currency] = apendix.split('_')
    const currencyCode = currency === 'USD' ? 'S' : 'N'
    const chainId = 56

    // expected RoundedCandle.id-S-600-1-all-0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2
    return `RoundedCandle.id-${currencyCode}-${interval}-${chainId}-all-${tokenAddress}`
  } catch (err) {
    console.error('Error while generating channelId', { error: err, ticker, resolution })
    return
  }
}

export const barMapper = (update: HistoryUpdateData): Bar => {
  const bar = {
    time: update.t_rounded * 1000,
    high: update.h,
    low: update.l,
    open: update.o,
    close: update.c,
    volume: update.v,
  }

  return bar
}

export const setHighLowCandleValue = (prev: Bar, current: Bar): Bar => {
  const _current = { ...current }
  _current.open = prev.close
  const maxOpen = Math.max(_current.open, _current.close)
  const minOpen = Math.min(_current.open, _current.close)

  if (_current.high < maxOpen) {
    _current.high = maxOpen
  }

  if (_current.low > minOpen) {
    _current.low = minOpen
  }

  return _current
}
