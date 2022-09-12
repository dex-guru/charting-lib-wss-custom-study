import { CustomIndicator } from '../../charting_library'

// TODO review when charting_library.d.ts is upgraded

export interface ExtendedCustomIndicator extends CustomIndicator {
  readonly name: string
  readonly metainfo: unknown
  readonly constructor: () => void
  init?: (context: Context, inputCallback: () => void) => void
  _context?: Context
  _input?: () => void
  main?: (context: Context, inputCallback: () => void) => void
}

export interface Context {
  new_sym: (symbol: string, period: string) => void
  select_sym: (value: number) => void
}
