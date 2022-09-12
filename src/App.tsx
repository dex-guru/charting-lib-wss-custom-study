import { FC } from 'react'

import TVChartContainerFunc from './components/TVChartContainer/TVChartContainerFunc'

const App: FC = () => {
  return (
    <div style={{ height: 900 }}>
      <TVChartContainerFunc
        symbolName="0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c-bsc_USD"
        hideResizeButton={false}
      />
    </div>
  )
}

export default App
