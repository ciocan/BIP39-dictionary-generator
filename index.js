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
  const templist = []

  while (templist.length < 20) {
    const randomWord = getRandom(sublist)
    if (!isSimilar(randomWord, templist)) {
      templist.push(randomWord)
    }
  }

  console.log(templist.sort())
  // let 
  // console.log(sublist)
  console.log(similarity("budaca", "budac"))
})

const getRandom = (list) => list[Math.floor(Math.random() * list.length)]

const isSimilar = (word, list, threshold = 0.2) => {

  list.forEach(listWord => {
    const similar = similarity(word, listWord)
    // console.log(similar)
    if (similar < threshold)  {
      return true
    }
  })

  return false
}