import React from 'react'

export const useComponentDidMount = (effectOnMount: () => void): void => {
  React.useEffect(
    () => {
      return effectOnMount()
    },
    // We don't have exhaustive deps here because we want to run the effect only on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )
}
