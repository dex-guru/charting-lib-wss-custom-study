import {
  ChartingLibraryWidgetOptions,
  CustomIndicator,
  LanguageCode,
  ResolutionString,
} from '../../../charting_library'
import { PineJS } from '../../../charting_library'
import Datafeed from '../datafeed/datafeed'
import liquidity from '../indicators/liquidity'

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(window.location.search)
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode)
}

export const defaultOverrides = {
  'mainSeriesProperties.candleStyle.upColor': '#26a69a',
  'mainSeriesProperties.candleStyle.downColor': '#ef5350',
  'mainSeriesProperties.candleStyle.drawWick': true,
  'mainSeriesProperties.candleStyle.drawBorder': true,
  'mainSeriesProperties.candleStyle.borderColor': '#378658',
  'mainSeriesProperties.candleStyle.borderUpColor': '#26a69a',
  'mainSeriesProperties.candleStyle.borderDownColor': '#ef5350',
  'mainSeriesProperties.candleStyle.wickUpColor': '#26a69a',
  'mainSeriesProperties.candleStyle.wickDownColor': '#ef5350',
  'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
  'paneProperties.background': '#232a32',
  'paneProperties.backgroundGradientStartColor': '#232a32',
  'paneProperties.backgroundGradientEndColor': '#232a32',
  'paneProperties.vertGridProperties.color': '#2E3740',
  'paneProperties.horzGridProperties.color': '#2E3740',
  'scalesProperties.textColor': '#7B7F84',
  'scalesProperties.backgroundColor': '#232A32',
  'paneProperties.axisProperties.autoScale': true,
  'mainSeriesProperties.priceAxisProperties.autoScale': true,
  'mainSeriesProperties.priceAxisProperties.log': false,
}

const TVChartsDefault = (chartId: string): ChartingLibraryWidgetOptions => {

  const dataFeed = Datafeed(chartId)

  return {
    locale: getLanguageFromURL() || 'en',
    interval: '10' as ResolutionString,
    container: 'tv_chart_container',
    datafeed: dataFeed,
    library_path: '/charting_library/',
    charts_storage_url: 'https://save-chart-api.dex.guru',
    charts_storage_api_version: '1.1',
    // timeframe: '1D',
    fullscreen: false,
    autosize: true,
    load_last_chart: false, // mandatory to set priceScale to auto on first load (for some reason lol it is really so)
    auto_save_delay: 5,
    disabled_features: ['header_symbol_search', 'display_market_status'],
    time_frames: [
      {
        text: '1y',
        resolution: '1D' as ResolutionString,
        description: '1 Year',
      },
      {
        text: '1m',
        resolution: '240' as ResolutionString,
        description: '1 Month',
      },
      {
        text: '7d',
        resolution: '60' as ResolutionString,
        description: '7 Days',
      },
      {
        text: '1d',
        resolution: '30' as ResolutionString,
        description: '1 Day',
        title: '1d',
      },
      {
        text: '12h',
        resolution: '10' as ResolutionString,
        description: '12 Hours',
        title: '12h',
      },
      {
        text: '1d',
        resolution: '30' as ResolutionString,
        description: 'Default',
        title: 'Default',
      },
    ],
    overrides: defaultOverrides,
    theme: 'Dark',
    custom_css_url: '/themed.css',
    custom_indicators_getter: function (PineJS: PineJS): Promise<CustomIndicator[]> {
      return Promise.resolve([liquidity(PineJS)])
    },
  }
}

export default TVChartsDefault
