import Daggy from 'daggy'
import { always, compose, curry } from 'ramda'
import { ap, chain, map } from 'fantasy-land'

import StateT from './state.transform'


// ----------------------------------------------------------------- //
// Constructors
// ----------------------------------------------------------------- //
export const State /*: StateClass */ = Daggy.tagged('State', [ '_fn' ])
State.of = val => State(state => [ val, state ])
State.get = () => State(state => [ state, state ])
State.modify = fn => State(state => [ null, fn(state) ])
State.put = state => State.modify(always(state))


// ----------------------------------------------------------------- //
// ADT Methods
// ----------------------------------------------------------------- //
State.prototype.chain = function(fn) {
  return State(s => {
    const [ val, state ] = this.runState(s)
    return fn(val).runState(state)
  })
}


// ----------------------------------------------------------------- //
// Derived ADT Methods
// ----------------------------------------------------------------- //
State.prototype.map = function(fn) {
  return this.chain(val => State.of(fn(val)))
}
State.prototype.ap = function(stateWithFn) {
  return stateWithFn.chain(fn => this.map(fn))
}


// ----------------------------------------------------------------- //
// State Methods
// ----------------------------------------------------------------- //
State.prototype.runState = function(initialState) {
  return this._fn(initialState)
}
State.prototype.evalState = function(initialState) {
  const [ val, _state ] = this.runState(initialState)
  return val
}
State.prototype.execState = function(initialState) {
  const [ _val, state ] = this.runState(initialState)
  return state
}



// ----------------------------------------------------------------- //
// Helper Functions
// ----------------------------------------------------------------- //
State.runState = curry(
  (monad, initState) => monad.runState(initState),
)
State.evalState = curry(
  (monad, initState) => monad.evalState(initState),
)
State.execState = curry(
  (monad, initState) => monad.execState(initState),
)


// ----------------------------------------------------------------- //
// Default and PointFree Exports
// ----------------------------------------------------------------- //
export default State
export { StateT }

export const runState = State.runState
export const evalState = State.evalState
export const execState = State.execState
