
// : (buttons: Record<string, HTMLElement>, initial_state: State)
export const reredux = (buttons, initital_state) => {
  let state = initital_state
  let state_subscriber = null
  let reducer = null

  const push = (button) => {
    const new_state = reducer(state, button)
    if (new_state !== undefined) {
      state = new_state
      state_subscriber(new_state)
      console.log(new_state)
    }
  }

  Object.keys(buttons).forEach(name => {
    buttons[name].addEventListener('mouseup', ev => push(name))
  })

  return {
    subscribe(cb) {
      state_subscriber = cb
    },
    reduce(cb) {
      reducer = cb
      return this
    }
  }
}