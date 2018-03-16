const Rx = require('rx')
const fs = require('fs')
const readline = require('readline')
const similarity = require('similarity')
const perf = require('execution-time')()
const accents = require('remove-accents')

const file = fs.createWriteStream('wordlist-filtered-all.txt')

const MIN_CHAR = 4
const MAX_CHAR = 11
const THRESHOLD = 0.43

const list = []
let i = 0

const rl = readline.createInterface({
  input: fs.createReadStream('wordlist-ro-all.txt')
})

perf.start()

const byLength = (str) => str.length >= MIN_CHAR && str.length <= MAX_CHAR
const removeAccents = (word) => accents(word).toLowerCase()

const isNotSimilar = (value, otherValues) => {
  const otherValuesButNotLast = otherValues.slice(0, otherValues.length - 1)
  const aSimilar = otherValuesButNotLast.find(otherValue => similarity(otherValue, value) >= THRESHOLD)
  return aSimilar === undefined
}

Rx.Observable.fromEvent(rl, 'line')
  .takeUntil(Rx.Observable.fromEvent(rl, 'close'))
  .filter(byLength)
  .map(removeAccents)
  // .take(10)
  .scan((previousValues, thisValue) => {
    i++
    if (i % 10000 === 0) console.log(i / 10000)
    previousValues.push(thisValue)
    return previousValues
  }, [])
  .map(previousValues => {
    const lastValue = previousValues[previousValues.length - 1]
    return { previousValues, lastValue }
  })
  .filter(data => isNotSimilar(data.lastValue, data.previousValues))
  .mergeMap(data => Rx.Observable.of(data.lastValue))
  .subscribe(
    (word) => {
      list.push(word)
      file.write(`${word}\n`)
    },
    err => console.log('Error: %s', err),
    () => {
      console.log('words: ', list.length)
      console.log('iterations: ', i)
      console.log(perf.stop().words)
      file.end()
    }
  )
