
export const pipe = (...fns) => (...args) => fns.reduce(
  (acc, fn, i) => i == 0 ? fn(...acc) : fn(acc)
, args)
export const ifElse = (pred, onTrue, onFalse) => x => pred(x) ? onTrue(x) : onFalse(x)
export const thunkify = fn => (...args) => () => fn(...args)
export const tap = (effect, fn) => (...args) => { const r = fn(...args); effect(r); return r }
const log = fn => tap(console.log.bind(console), fn)
export const log1 = x => {console.log(x); return x}
export const either = (a, b) => x => a(x) || b(x)

export const append = suffix => string => string.concat(suffix)
export const drop = (n, array) => array.slice(n)

export const includes = value => string => Array.prototype.includes.call(string, value)

export const prop = key => object => object[key]
export const assoc = key => value => object => ({ ...object, [key]: value })
export const lens = (get, set) => ({ get, set })
export const view = lens => obj => lens.get(obj)
export const set = (lens, value) => obj => lens.set(value, obj)
export const over = lens => fn => obj => lens.set(fn(lens.get(obj)), obj)


const setPath = path => (value, obj) => {
  const p = path.split('.')
  if (p.length === 1)
    return assoc(p[0])(value)(obj)
  else
    return assoc(p[0])(setPath(drop(1, p))(value)(obj[p[0]]))(obj)
}
export const lensPath = path => lens(
  obj => path.split('.').reduce((acc, key) => acc[key], obj),
  setPath(path)
)
