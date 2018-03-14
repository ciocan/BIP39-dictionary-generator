const similarity = require("similarity")
const LineByLineReader = require('line-by-line')

const alphabet = "abcdefghilmnoprstuvz"
const WORDS_PER_LETTER = 203

const words = new LineByLineReader('wordlist-ro.txt')
const list = []
const bip39 = []

words.on('line', (line) => {
  if (line.length >= 4 && line.length <= 8) {
    list.push(line)
  }
})

words.on('end', () => {
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

const isSimilar = (word, list, threshold = 0.2) => {

  list.forEach(listWord => {
    const similarityScore = similarity(word, listWord)
    console.log(similarityScore)
    if (similarityScore > threshold) {
      return true
    }
  })

  return false
}