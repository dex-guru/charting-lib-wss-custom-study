import * as ReactDOMClient from 'react-dom/client'

import App from './App'
import WebsocketsWrapper from './containers/WebsocketsWrapper'

import(/* webpackPrefetch: true */ './scss/index.scss').then()

const rootElement = document.getElementById('root')
if (rootElement) {
  const root = rootElement && ReactDOMClient.createRoot(rootElement)
  root.render(
    <WebsocketsWrapper>
      <App />
    </WebsocketsWrapper>
  )
}
