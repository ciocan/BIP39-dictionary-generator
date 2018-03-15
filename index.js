import Rx from 'rx'
import { pairwise, take, scan, map } from 'rxjs/operators'
import fs from 'fs'
import readline from 'readline'
import similarity from 'similarity'

const alphabet = "abcdefghilmnoprstuvz"
const WORDS_PER_LETTER = 203
const THRESHOLD = 0.2

const rl = readline.createInterface({
  input: fs.createReadStream('wordlist-ro.txt')
})

const byLength = (str) => str.length >= 4 && str.length <= 8
const startsWith = (letter) => (word) => word.startsWith(letter)

const lines = Rx.Observable.fromEvent(rl, 'line')
  .takeUntil(Rx.Observable.fromEvent(rl, 'close'))
  .filter(startsWith('a'))
  .filter(byLength)
  .take(20)
  .subscribe(
    console.log,
    // () => null,
    err => console.log('Error: %s', err),
    () => console.log('Completed')
  )

// console.log(similarity('zaliseam', 'zaliseau'))
