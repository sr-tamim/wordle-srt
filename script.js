
// define some congrats wishes for winners
const allWishes = ['Magnificent', 'Spectacular', 'Impressive', 'Splendicious', 'Skilful', 'Splendid', 'Marvellous', 'Brilliant', 'Excellent']

// constant variables
const board = document.getElementById('letter-board')
const keyboard = document.getElementById('keyboard')

const releaseDate = new Date(2022, 1, 6)
const today = Date.now()
const dayIndex = Math.floor((today - releaseDate.valueOf()) / (1000 * 60 * 60 * 24))

// animation durations
const FLIP_DURATION = 500
const POP_DURATION = 100


// get all data from json file
let dictionary, todaysWord
loadAllData()
async function loadAllData() {
    const getDictionary = await fetch('/dictionary.json')
    const getAllWords = await fetch('/targetWords.json')
    dictionary = await getDictionary.json()
    allWords = await getAllWords.json()
    todaysWord = allWords[dayIndex]
    allowInput()
}


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
    if (e.target.tagName === "BUTTON") {
        e.target.dataset.animation = 'pop'
        setTimeout(() => delete e.target.dataset.animation, POP_DURATION)
    }
}

const getActiveBoxes = () => [...board.querySelectorAll('.box[data-state="active"]')]
const getEmptyBoxes = () => [...board.querySelectorAll('.box[data-state="empty"]')]
const setBoxAnimationState = (box, state) => box.dataset.animation = state
const createAlert = (alert, duration = 1000) => {
    const container = document.getElementById('alerts-container')
    const div = document.createElement('div')
    div.classList.add('alert')
    div.textContent = alert
    container.prepend(div)
    setTimeout(() => {
        div.dataset.animation = 'fade-out'
        div.addEventListener('animationend', () => container.removeChild(div), { once: true })
    }, duration)
}

function processInput(key) {
    const activeBoxes = getActiveBoxes()
    if (key === "Enter") {
        processSubmit()
        return
    } else if (key === "Backspace") {
        processDelete()
        return
    } else if (activeBoxes.length < 5) {
        const nextBox = getEmptyBoxes()[0]
        if (!nextBox) return
        nextBox.textContent = key
        nextBox.dataset.letter = key
        nextBox.dataset.state = 'active'
        setBoxAnimationState(nextBox, 'pop')
        setTimeout(() => setBoxAnimationState(nextBox, 'idle'), POP_DURATION)
    }
}

function processDelete() {
    const filledBoxes = [...board.querySelectorAll('[data-state="active"]')]
    if (filledBoxes.length === 0) return
    const lastBox = filledBoxes.pop()
    lastBox.textContent = ""
    lastBox.dataset.state = 'empty'
    delete lastBox.dataset.letter
}

function processSubmit() {
    blockInput()
    const activeBoxes = getActiveBoxes()
    if (activeBoxes.length < 5) {
        createAlert("Not enough letters")
        allowInput()
        return
    }

    const submission = activeBoxes.reduce((word, box) => word + box.dataset.letter, "")
    if (dictionary && !dictionary.includes(submission)) {
        createAlert("Unknown word")
        allowInput()
        return
    }

    activeBoxes.forEach((box, index) => {
        setTimeout(() => {
            setBoxAnimationState(box, 'flip-in')

            setTimeout(() => {
                // add state by checking the letter of previous box
                if (todaysWord[index] === box.textContent) {
                    box.dataset.state = 'correct'
                    keyboard.querySelector(`[data-key="${todaysWord[index]}"]`).dataset.state = 'correct'
                }
                else if (todaysWord.includes(box.textContent)) {
                    box.dataset.state = 'present'
                    keyboard.querySelector(`[data-key="${box.textContent}"]`).dataset.state = 'present'
                } else {
                    box.dataset.state = 'wrong'
                    keyboard.querySelector(`[data-key="${box.textContent}"]`).dataset.state = 'wrong'
                }

                setBoxAnimationState(box, 'flip-out')
                setTimeout(() => setBoxAnimationState(box, 'idle'), FLIP_DURATION / 2)


                // check win or lose
                if (index === activeBoxes.length - 1) {
                    if ((activeBoxes.filter(box => box.dataset.state === 'correct')).length === 5) {
                        createAlert(allWishes[Math.round(Math.random() * (allWishes.length - 1))], 5000)

                        activeBoxes.forEach((box, i) => {
                            setTimeout(() => {
                                box.dataset.animation = "bounce"
                                setTimeout(() => activeBoxes.forEach(box => box.dataset.animation = "idle"), 1000)
                            }, 100 * i)
                        })
                    }
                    else if (getEmptyBoxes().length === 0) {
                        createAlert('You Lost', 5000)
                    }
                    else {
                        // allow user input after animation ends
                        allowInput()
                    }
                }
            }, FLIP_DURATION / 2)

        }, FLIP_DURATION * (index + 1) / 2)
    })
}