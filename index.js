const fs = require('fs')
const LineByLineReader = require('line-by-line')
const similarity = require('similarity')
const perf = require('execution-time')()
const accents = require('remove-accents')

const MIN_CHAR = 4
const MAX_CHAR = 11
const THRESHOLD = 0.43

perf.start()

const allWords = new LineByLineReader('wordlist-ro-all.txt')
const list = []
let i = 0

const filterByLength = (word) => word.length >= MIN_CHAR && word.length <= MAX_CHAR

allWords.on('line', (word) => {
  i++
  if (filterByLength(word)) {
    let excluded = false
    const transformedWord = accents(word).toLowerCase()

    list.every(_word => {
      if ((
        transformedWord.substr(0, 4) === _word.substr(0, 4) &&
        transformedWord.substr(0, 4).length <= 4
      ) || transformedWord.includes('-')
      ) {
        excluded = true
        return false
      }

      if (similarity(_word, transformedWord) >= THRESHOLD) {
        excluded = true
        return false
      }

      return true
    })

    if (i % 10000 === 0) console.log(i / 1000)
    if (!excluded) list.push(transformedWord)
  }
})

allWords.on('end', () => {
  console.log('length: ', list.length)

  const file = fs.createWriteStream('wordlist-filtered-all.txt')
  list.forEach(word => file.write(`${word}\n`))
  file.end()

  console.log(perf.stop().words)
})
