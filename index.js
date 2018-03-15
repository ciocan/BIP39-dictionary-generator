import fs from 'fs'
import LineByLineReader from 'line-by-line'
import similarity from 'similarity'

// const THRESHOLD = 0.6251
const MIN_CHAR = 4
const MAX_CHAR = 10
const THRESHOLD = 0.57

const allWords = new LineByLineReader('wordlist-ro.txt')
const list = []

const filterByLength = (word) => word.length >= MIN_CHAR && word.length <= MAX_CHAR

allWords.on('line', (line) => {
  if (filterByLength(line)) {
    let excluded = false

    list.forEach(word => {
      if (similarity(word, line) >= THRESHOLD) {
        excluded = true
      }
    })

    if (!excluded) list.push(line)
  }
})

allWords.on('end', () => {
  console.log(list.length)
  list.forEach((word, index) => {
    if (index < 30) console.log(word)
  })

  const file = fs.createWriteStream('wordlist-filtered.txt')
  list.forEach(word => file.write(`${word}\n`))
  file.end()
})
