import React, { createContext, useContext, useReducer, useMemo } from 'react'
import hoistStatics from 'hoist-non-react-statics'
import * as R from 'ramda'
import reducer from './reducers'
import { updateStore } from './utils'

const transferState = global.__STATE__
const StoreContext = createContext({})

const memorize = o => {
  let cache = []

  const memo = JSON.stringify(o, function (key, value) {
    if (typeof value === 'object' && value !== null) {
      if (cache.indexOf(value) !== -1) return

      // Store value in our collection
      cache.push(value)
    }

    return value
  })

  cache = null

  return memo
}

export function StoreProvider (props) {
  const { state: calcState, children } = props
  const initialState = calcState || transferState || {}
  const [state, dispatch] = useReducer(reducer, initialState)

  updateStore(state)

  return (
    <StoreContext.Provider value={{ state, dispatch }}>
      {children}
    </StoreContext.Provider>
  )
}

export function withStore (fn) {
  return Component => {
    function C (ownProps) {
      const { state, dispatch } = useContext(StoreContext)
      const stateProps = fn(state, dispatch, ownProps)
      const allProps = { ...ownProps, ...stateProps }

      return useMemo(
        () => <Component {...ownProps} {...stateProps} />,
        R.pipe(
          R.omit(['children']),
          R.values,
          R.map(memorize)
        )(allProps)
      )
    }

    return hoistStatics(C, Component)
  }
}
