
const board = document.getElementById('letter-board')
const keyboard = document.getElementById('keyboard')

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

    activeBoxes.forEach(box => {
        box.classList.remove('active')
        box.classList.add('submitted')
    })
    allowInput()
}