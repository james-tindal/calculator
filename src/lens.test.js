
import assert from 'assert'
import { lens, view, set, over, lensPath } from './util.js'

const obj = {
  a: 2,
  b: []
}

const l = lens(
  obj => obj.a,
  (value, obj) => ({ ...obj, a: value })
)

assert.equal(
  view(l)(obj),
  2,
  'View works')
assert.deepEqual(
  set(l, 200)(obj),
  { a: 200, b: []},
  'Set works')
assert.deepEqual(
  over(l)(n => n * n)(obj), 
  { a:4, b: [] },
  'Over works')


// lensPath

const lp = lensPath('a')

assert.equal(
  view(lp)(obj),
  2,
  'lensPath: View works')
assert.deepEqual(
  set(lp, 200)(obj),
  { a: 200, b: []},
  'lensPath: Set works')
assert.deepEqual(
  over(lp)(n => n * n)(obj), 
  { a:4, b: [] },
  'lensPath: Over works')



console.log('All assertions passed')