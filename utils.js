import * as R from 'ramda'

let store = {}

export const updateStore = s => {
  store = s
  return s
}

export const getStore = () => ({ ...store })

export function combineReducers (key, reducers) {
  return R.pipe(
    R.toPairs,
    R.map(([action, reducer]) => ({
      path: typeof key === 'object' ? key : [key],
      reducer,
      action
    }))
  )(reducers)
}
