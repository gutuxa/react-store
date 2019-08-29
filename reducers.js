import * as R from 'ramda'

const reducers = [

]

export default (state, action) => (
  R.pipe(
    R.filter(R.propEq('action', action.type)),
    R.values,
    R.defaultTo([]),
    R.reduce((state, { reducer, path }) => (
      R.assocPath(path, reducer(R.prop(path, state), action), state)
    ), state)
  )(reducers)
)
