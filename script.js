
const board = document.getElementById('letter-board')
const keyboard = document.getElementById('keyboard')

const FLIP_DURATION = 500

// get dictionary words from json file
let dictionary
getDictionary()
async function getDictionary() {
    const res = await fetch('/dictionary.json')
    const result = await res.json()
    console.log('Dictionary loaded')
    dictionary = result
}

// get targetWords from json file
let targetWords
getTargetWords()
async function getTargetWords() {
    const res = await fetch('/targetWords.json')
    const result = await res.json()
    console.log('target words loaded')
    targetWords = result
}

allowInput()
function allowInput() {
    keyboard.addEventListener('click', processMouseClick)
    document.addEventListener('keyup', processKeyboardType)
}
function blockInput() {
    keyboard.removeEventListener('click', processMouseClick)
    document.removeEventListener('keyup', processKeyboardType)
}

function processKeyboardType(e) {
    (e.key.match(/^[a-z]$/) || e.key === "Enter" || e.key === "Backspace") && processInput(e.key)
}
function processMouseClick(e) {
    console.log(e)
    e.target.dataset.key && processInput(e.target.dataset.key)
}

function getActiveBoxes() { return [...board.querySelectorAll('.box.active')] }

function processInput(key) {
    console.log(key)
    const activeBoxes = getActiveBoxes()
    if (key === "Enter") {
        processSubmit()
        return
    } else if (key === "Backspace") {
        processDelete()
        return
    } else if (activeBoxes.length < 5) {
        const emptyBox = board.querySelector(':not([data-letter])')
        emptyBox.textContent = key
        emptyBox.dataset.letter = key
        emptyBox.classList.add('active')
    }
}

function processDelete() {
    const activeBoxes = getActiveBoxes()
    if (activeBoxes.length === 0) return
    const lastBox = activeBoxes.pop()
    lastBox.textContent = ""
    delete lastBox.dataset.letter
    lastBox.classList.remove('active')
}

function processSubmit() {
    blockInput()
    const activeBoxes = getActiveBoxes()
    if (activeBoxes.length < 5) {
        console.log("Not enough letters")
        allowInput()
        return
    }

    const submission = activeBoxes.reduce((word, box) => word + box.dataset.letter, "")
    if (dictionary && !dictionary.includes(submission)) {
        console.log("Unknown word")
        allowInput()
        return
    }


    const todaysWord = targetWords[6]
    console.log(todaysWord, submission)
    activeBoxes.forEach((box, index) => {
        setTimeout(() => {
            box.classList.remove('active')
            box.classList.add('submitted')
            box.classList.add('flip')
            setTimeout(() => box.classList.remove('flip'), FLIP_DURATION * 1.5)

            // add state by checking the letter of previous box
            if (index < 1) return
            if (todaysWord[index - 1] === activeBoxes[index - 1].textContent) {
                activeBoxes[index - 1].classList.add('correct')
                keyboard.querySelector(`[data-key="${todaysWord[index - 1]}"]`).classList.add('correct')
            }
            else if (todaysWord.includes(activeBoxes[index - 1].textContent)) {
                activeBoxes[index - 1].classList.add('present')
                keyboard.querySelector(`[data-key="${activeBoxes[index - 1].textContent}"]`).classList.add('present')
            }
        }, FLIP_DURATION * (index + 1) / 2)
    })

    allowInput()
}