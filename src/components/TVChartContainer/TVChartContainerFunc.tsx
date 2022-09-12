import classNames from 'classnames'
import React, { FC, useCallback, useEffect, useRef } from 'react'

import {
  ChartingLibraryWidgetOptions,
  IChartingLibraryWidget,
  widget,
} from '../../charting_library'
import { useComponentDidMount } from '../../hooks/useComponentDidMount'
import { usePrevWebsocketState } from '../../hooks/usePrevWebsocketState'
import { liquidityIndicatorName } from './indicators/liquidity'
import ChartResources, { defaultOverrides } from './resources/TVChartResources'

const TVChartResources = ChartResources('TVCHART_MAIN_LABEL')

interface TVChartContainerProps {
  symbolName: string
  isReadOnlyMarket?: boolean
  hideResizeButton: boolean
}

const TVChartContainerFunc: FC<TVChartContainerProps> = (props) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<IChartingLibraryWidget | undefined | null>(undefined)

  const defaultProps = TVChartResources

  const getWidgetConfig = useCallback((): ChartingLibraryWidgetOptions => {
    if (widgetRef.current) {
      widgetRef.current.remove()
    }

    return {
      ...TVChartResources,
      symbol: props.symbolName,
      disabled_features: TVChartResources.disabled_features,
      user_id: undefined,
      container:
        containerRef && containerRef.current ? containerRef.current : defaultProps.container,
      interval: TVChartResources.interval,
    }
  }, [defaultProps.container, props.symbolName])

  const getOnChartReadyHandler = (): void => {
    if (!widgetRef.current) {
      return
    }

    widgetRef.current.applyOverrides(defaultOverrides)
    if (
      !widgetRef.current
        .activeChart()
        .getAllStudies()
        .some((x) => x.name === liquidityIndicatorName)
    ) {
      widgetRef.current.activeChart().createStudy(liquidityIndicatorName)
    }
  }

  const initWidget = useCallback(() => {
    widgetRef.current && widgetRef.current.remove()
    const widgetOptions = getWidgetConfig()
    const widgetInstance = new widget(widgetOptions)
    widgetRef.current = widgetInstance
    widgetRef.current.onChartReady(getOnChartReadyHandler)
  }, [getWidgetConfig])

  usePrevWebsocketState(initWidget)

  useComponentDidMount(() => {
    return (): void => {
      if (widgetRef.current) {
        widgetRef.current.remove()
        widgetRef.current = null
      }
    }
  })

  useEffect(() => {
    try {
      const activeChart = widgetRef.current && widgetRef.current.activeChart()

      if (!activeChart) {
        initWidget()
        return
      }

      activeChart.setSymbol(props.symbolName)
    } catch (err: ReturnType<Error>) {
      console.error(err.message, err)
    }
  }, [props.symbolName, initWidget])

  return (
    <React.Fragment>
      <div
        ref={containerRef}
        id={defaultProps.container as string}
        className={classNames(
          'tv-chart',
          {
            'not-resizeable': true,
          },
          { resizable: false }
        )}
      />
    </React.Fragment>
  )
}

export default TVChartContainerFunc
