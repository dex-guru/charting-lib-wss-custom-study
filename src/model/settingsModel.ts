export enum GasFeeType {
  instant = 'instant',
  fast = 'fast',
  overkill = 'overkill',
}

export enum SettingsFields {
  slippage = 'slippage',
  gasFee = 'gasFee',
  isLeftDrawerOpen = 'isLeftDrawerOpen',
  isRightDrawerOpen = 'isRightDrawerOpen',
  tvChartHeight = 'tvChartHeight',
  allowHighSlippageTxn = 'allowHighSlippageTxn',
  isChartFullScreen = 'isChartFullScreen',
  multichart = 'multichart',
}

export interface Settings {
  slippage: number
  gasFee: GasFeeType
  isLeftDrawerOpen: boolean
  isRightDrawerOpen: boolean
  tvChartHeight?: string
  allowHighSlippageTxn: boolean
  isChartFullScreen: boolean
}
