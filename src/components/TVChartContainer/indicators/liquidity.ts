import { PineJS } from '../../../charting_library'
import { Context, ExtendedCustomIndicator } from '../types'
export const liquidityIndicatorId = 'token-liquidity@tv-basicstudies-1'
export const liquidityIndicatorName = 'Token Liquidity'

const liquidityIndicator = (PineJS: PineJS): ExtendedCustomIndicator => {
  return {
    name: 'token-liquidity',
    metainfo: {
      _metainfoVersion: 51,
      id: liquidityIndicatorId,
      description: liquidityIndicatorName,
      shortDescription: liquidityIndicatorName,
      is_hidden_study: false,
      is_price_study: false,
      isCustomIndicator: true,
      format: {
        type: 'volume',
        precision: 2,
      },
      plots: [{ id: 'plot_0', type: 'line' }],
      defaults: {
        styles: {
          plot_0: {
            linestyle: 0,
            visible: true,
            linewidth: 2,
            plottype: 2,

            // Show price line?
            trackPrice: true,

            // Plot color
            color: '#9488f0',
          },
        },
        precision: 2,
        inputs: {},
      },
      styles: {
        plot_0: {
          title: 'PlotName',
          histogramBase: 0,
        },
      },
      inputs: [],
    },

    constructor: function (): void {
      this.init = function (context: Context, inputCallback: () => void): void {
        this._context = context
        this._input = inputCallback

        // Define the symbol to be plotted.
        // Symbol should be a string.
        // You can use PineJS.Std.ticker(this._context) to get the selected symbol's ticker.
        const symbol = `${PineJS.Std.ticker(this._context)}-indicators`
        this._context?.new_sym(symbol, PineJS.Std.period(this._context))
      }
      this.main = function (context, inputCallback): unknown {
        this._context = context
        this._input = inputCallback
        this._context.select_sym(1)
        // You can use following built-in functions in PineJS.Std object:
        //    open, high, low, close
        //    hl2, hlc3, ohlc4

        // In the *-indicators ticker we don't use `v` variable, so it should be none
        // Otherwise, the data comes from WS candles and it is not supposed to be a data source for the indicator
        const liq = PineJS.Std.open(this._context)
        return [liq]
      }
    },
  }
}

export default liquidityIndicator
