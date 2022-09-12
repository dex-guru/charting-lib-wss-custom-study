/* eslint-disable */
/// <reference types="node" />
/// <reference types="react" />
/// <reference types="react-dom" />

declare const window: Window & typeof globalThis

interface Window {
  Datafeeds: {
    // NOTE that this should match signature in udf-compatible-datafeed.ts
    UDFCompatibleDatafeed: new (url?: string, value: number, headers: HeadersInit) => IBasicDataFeed
  }
  freezeTVChart: boolean

  attachEvent: (action: string, callback: () => void) => void
}

declare module 'react-app-polyfill/ie11'
declare module 'react-app-polyfill/stable'

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test'
    readonly PUBLIC_URL: string
  }
}

declare module '*.avif' {
  const src: string
  export default src
}

declare module '*.bmp' {
  const src: string
  export default src
}

declare module '*.gif' {
  const src: string
  export default src
}

declare module '*.jpg' {
  const src: string
  export default src
}

declare module '*.jpeg' {
  const src: string
  export default src
}

declare module '*.png' {
  const src: string
  export default src
}

declare module '*.webp' {
  const src: string
  export default src
}

declare module '*.svg' {
  import * as React from 'react'

  export const ReactComponent: React.FunctionComponent<
    React.SVGProps<SVGSVGElement> & { title?: string }
  >

  const src: string
  export default src
}

declare module '*.m.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.scss' {
  const classes: { readonly [key: string]: string }
  export default classes
}
