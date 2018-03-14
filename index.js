const similarity = require("similarity")
const LineByLineReader = require('line-by-line')

const alphabet = "abcdefghilmnoprstuvz"
const WORDS_PER_LETTER = 203
const THRESHOLD = 0.3

const allWords = new LineByLineReader('wordlist-ro.txt')
const list = []
const bip39 = []

allWords.on('line', (line) => {
  if (line.length >= 4 && line.length <= 8) {
    list.push(line)
  }
})

allWords.on('end', () => {
  // console.log(list.length)
  const sublist = list.filter(word => word.startsWith('b'))
  const bipList = []

  while (bipList.length < 10) {
    const randomWord = getRandom(sublist)
    if (!isSimilar(randomWord, bipList)) {
      bipList.push(randomWord)
    }
  }

  console.log(bipList.sort())
  // let 
  // console.log(sublist)
  console.log(similarity("borzoia", "borzoise"))
})

const getRandom = (list) => list[Math.floor(Math.random() * list.length)]

const isSimilar = (word, words, threshold = THRESHOLD) => {

  words.forEach(_word => {
    const score = similarity(word, _word)
    console.log(score, _word)
    if (score > threshold) {
      return true
    }
  })

  return false
}