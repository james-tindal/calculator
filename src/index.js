
import { reredux } from './reredux.js'
import { append, either, ifElse, includes, lensPath, over, pipe, tap, log1, assoc } from './util.js'
import { beep } from './beep.js'

//    recordify: (coll: HTMLCollection): Record<string, HTMLElement>
const recordify = coll => Object.fromEntries(
  Object.getOwnPropertyNames(coll).filter(isNaN).map(k => [k, coll[k]]))

const { display, ...buttons } =
  recordify(document.querySelector('#calculator').children)

const run_op = ({ operation, operand1, operand2 }) => {
  const a = Number(operand1)
  const b = Number(operand2)
  const result = {
    add: a + b,
    subtract: a - b,
    multiply: a * b,
    divide: a / b
  }[ operation ]
  return { operand1: result }
}

const display_manager = state => {
  if (state === undefined) return
  const { operation, operand1, operand2 } = state
  
  // Display operand1, unless !!operation && !!operand2
  const display =
    !operand1
    ? 0
    : !!operation && !!operand2
      ? operand2 : operand1

  return { ...state, display }
}

const _o_f = ({ display, operation, operand1, operand2  }) =>
  ({ display, operation,
    operand1: operand1 || '',
    operand2: operand2 || ''  })

const operand_fixer = state => state && _o_f(state)

const initial_state = {
  display: null,
  operand1: '',
  operation: null,
  operand2: ''
}

reredux(buttons, initial_state)
.reduce(pipe(
  (state, button) => {
    const operand = state.operation === null ? 'operand1' : 'operand2'
    if (button.startsWith('num'))
      return over(lensPath(operand))(append(button[3]))(state)

    if (button == 'decimal-point')
      // If operand includes '.' already OR length < 1
      // ? beep()
      // : append decimal point
      return over(
        lensPath(operand))
        (ifElse(
          either(includes('.'), op => op.length < 1),
          tap(beep, x => x),
          append('.')
        ))
        (state)


    const { operand2 } = state
    if (['divide', 'multiply', 'subtract', 'add'].includes(button))
    // If !!operand2 ? run previous operation, operand1 = result, operation = button
    // Else: operation = button
      return !!operand2 ? { ...run_op(state), operation: button } :  { ...state, operation: button }
    
    if (button == 'equals')
      return !!operand2 ? run_op(state) : state
    
    if (button == 'clear')
      return initial_state
  },
  operand_fixer,
  display_manager
))
.subscribe(state => {
  display.textContent = state.display
})
