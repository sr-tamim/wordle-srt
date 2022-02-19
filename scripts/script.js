
// toggle dark mode
function toggleDarkMode(element) {
    const htmlClassList = document.querySelector('html').classList;
    [...htmlClassList].includes('dark') ? htmlClassList.remove('dark') : htmlClassList.add('dark')

    const darkModeStatus = [...htmlClassList].includes('dark')
    const savedData = JSON.parse(localStorage.getItem('user-data'))
    const newData = savedData ? { ...savedData, darkMode: darkModeStatus }
        : { darkMode: darkModeStatus }
    localStorage.setItem('user-data', JSON.stringify(newData))

    if (element) {
        const darkMode = [...htmlClassList].includes('dark')
        if (darkMode) {
            element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" data-name="Layer 1" viewBox="0 0 64 64">
                <path d="M47.48,8.69A29,29,0,0,0,40,4.08a1,1,0,0,0-1.24,1.46A27.7,27.7,0,0,1,36.6,38.22,27,27,0,0,1,3.45,45.28a1,1,0,0,0-1.17.19,1,1,0,0,0-.16,1.18A29.54,29.54,0,0,0,9,55.05a29.08,29.08,0,0,0,18.91,7c.86,0,1.73,0,2.61-.11A29.83,29.83,0,0,0,50.94,51.11,30.35,30.35,0,0,0,47.48,8.69Z"/>
            </svg>`
        } else {
            element.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                <path
                    d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm6.312-10.897c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" />
            </svg>`
        }
    }
}

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
const FADE_DURATION = 500
const SHAKE_DURATION = 600
const BOUNCE_DURATION = 1000


// get all data from json file
let dictionary, todaysWord
loadAllData()
async function loadAllData() {
    const getDictionary = await fetch('dictionary.json')
    const getAllWords = await fetch('targetWords.json')
    dictionary = await getDictionary.json()
    allWords = await getAllWords.json()
    todaysWord = allWords[dayIndex]
    allowInput()
}

// allow input letter by user
function allowInput() {
    keyboard.addEventListener('click', processMouseClick)
    document.addEventListener('keyup', processKeyboardType)
}
// block inputing letter by user
function blockInput() {
    keyboard.removeEventListener('click', processMouseClick)
    document.removeEventListener('keyup', processKeyboardType)
}

// keyboard functionality for computers
function processKeyboardType(e) {
    (e.key.match(/^[a-z]$/) || e.key === "Enter" || e.key === "Backspace") && processInput(e.key)
}
// on-screen keyboard functionality
function processMouseClick(e) {
    e.target.dataset.key && processInput(e.target.dataset.key)
    if (e.target.tagName === "BUTTON") {
        e.target.dataset.animation = 'pop'
        setTimeout(() => delete e.target.dataset.animation, POP_DURATION)
    }
}

// get 5 active letter boxes
const getActiveBoxes = () => [...board.querySelectorAll('.box[data-state="active"]')]
// get all empty boxes
const getEmptyBoxes = () => [...board.querySelectorAll('.box[data-state="empty"]')]
// set up letter box animation
const setBoxAnimationState = (box, state) => box.dataset.animation = state

// create new alert notification
const createAlert = (alert, duration = 1000) => {
    const container = document.getElementById('alerts-container')
    container.style.display = 'block'
    const div = document.createElement('div')
    div.classList.add('alert')
    div.textContent = alert
    container.prepend(div)
    setTimeout(() => {
        div.dataset.animation = 'fade-out'
        div.addEventListener('animationend', () => container.removeChild(div), { once: true })
    }, duration)
}

// process input letters to show in UI
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

// clear letter box
function processDelete() {
    const activeBoxes = getActiveBoxes()
    if (activeBoxes.length === 0) return
    const lastBox = activeBoxes.pop()
    lastBox.textContent = ""
    lastBox.dataset.state = 'empty'
    delete lastBox.dataset.letter
}

// check the user's submission
function processSubmit(boxes = getActiveBoxes(), checkWinner = true) {
    blockInput() // first stop user from inputing letters

    // check if 5 letters are there or not
    if (boxes.length < 5) {
        createAlert("Not enough letters")
        allowInput()
        return
    }

    // gather all letters
    const submission = boxes.reduce((word, box) => word + box.dataset.letter, "")

    // unknown word animation
    if (dictionary && !dictionary.includes(submission)) {
        createAlert("Unknown word")
        boxes.forEach((box, i) => {
            box.dataset.animation = "shake"
            setTimeout(() => boxes.forEach(box => box.dataset.animation = "idle"), SHAKE_DURATION)
        })
        allowInput()
        return
    }

    checkWinner && saveToLocalStorage() // save data to local storage

    boxes.forEach((box, index) => {
        setTimeout(() => {
            setBoxAnimationState(box, 'flip-in') // add flip in animation

            // start next function after flip in animation ends
            box.addEventListener('animationend', () => {
                // add state by checking the letter of previous box
                if (todaysWord[index] === box.textContent) {
                    box.dataset.state = 'correct'
                    keyboard.querySelector(`[data-key="${todaysWord[index]}"]`).dataset.state = 'correct'
                } else if (todaysWord.includes(box.textContent)) {
                    box.dataset.state = 'present'
                    keyboard.querySelector(`[data-key="${box.textContent}"]`).dataset.state = 'present'
                } else {
                    box.dataset.state = 'wrong'
                    keyboard.querySelector(`[data-key="${box.textContent}"]`).dataset.state = 'wrong'
                }

                setBoxAnimationState(box, 'flip-out') // set flip out animation

                // reset animation state after filp out animation ends
                box.addEventListener('animationend', () => setBoxAnimationState(box, 'idle'), { once: true })


                // check win or lose
                if (checkWinner && index === boxes.length - 1) {
                    if ((boxes.filter(box => box.dataset.state === 'correct')).length === 5) {
                        // show notification with a random wish
                        createAlert(allWishes[Math.round(Math.random() * (allWishes.length - 1))], 5000)

                        boxes.forEach((box, i) => {
                            setTimeout(() => {
                                box.dataset.animation = "bounce"
                                setTimeout(() => boxes.forEach(box => box.dataset.animation = "idle"), BOUNCE_DURATION)
                            }, 100 * i)
                        })
                    }
                    // check if any chances left or not
                    else if (getEmptyBoxes().length === 0) {
                        // show Notification if no chance left
                        createAlert(`Today's word is "${todaysWord.toUpperCase()}"`, 5000)
                    }
                    else {
                        // allow user input after checking
                        allowInput()
                    }
                }
            }, { once: true })

        }, FLIP_DURATION * (index + 1) / 2)
    })
}

// get data from local storage
getFromLocalStorage()
function getFromLocalStorage() {
    const savedData = JSON.parse(localStorage.getItem('user-data'))

    // nothing happens if no saved data found
    if (!savedData) return

    const { letters } = savedData
    const previousDate = new Date(savedData.date)
    const currentDate = new Date()

    // if the data is from another day nothing will be done
    if (currentDate.getDate() !== previousDate.getDate()) return

    // write all the letters from saved data to user interface
    letters.forEach(letter => {
        const nextBox = getEmptyBoxes()[0]
        if (!nextBox) return
        nextBox.textContent = letter
        nextBox.dataset.letter = letter
        nextBox.dataset.state = 'active'
    })
    // submit all the letters one by one
    for (let i = 0; i <= (letters.length - 5); i++) {
        i % 5 || processSubmit(getActiveBoxes().slice(i, i + 5), false)
    }
}

// save data to local storage
function saveToLocalStorage() {
    const filledBoxes = [...board.querySelectorAll(':not(.box[data-state="empty"])')]
    const letters = filledBoxes.map(box => box.dataset.letter)
    const date = Date.now()
    const previousData = JSON.parse(localStorage.getItem('user-data')) || {}
    const newData = { ...previousData, letters, date }
    localStorage.setItem('user-data', JSON.stringify(newData))
}


// modal close listener
const modal = document.getElementById('modal-container')


modal.style.display === 'none' || modal.addEventListener('click', () => {
    modal.dataset.animation = 'fade-out'
    setTimeout(() => {
        modal.style.display = 'none'
        modal.lastChild && modal.removeChild(modal.lastChild)
    }, FADE_DURATION)
}, { once: true })