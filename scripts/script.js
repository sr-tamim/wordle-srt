
// define some congrats wishes for winners
const allWishes = ['Magnificent', 'Spectacular', 'Impressive', 'Splendicious', 'Skilful', 'Splendid', 'Marvellous', 'Brilliant', 'Excellent']

// constant variables
const board = document.getElementById('letter-board')
const keyboard = document.getElementById('keyboard')
const overlayContainer = document.getElementById('overlay-container')
const modal = document.getElementById('modal-container')

const releaseDate = new Date(2022, 1, 6)
const today = Date.now()
const dayIndex = Math.floor((today - releaseDate.valueOf()) / (1000 * 60 * 60 * 24))

// animation durations
const FLIP_DURATION = 500
const POP_DURATION = 100
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
    getFromLocalStorage()
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
    if (e.target.dataset.key) {
        e.target.dataset.key && processInput(e.target.dataset.key)
        e.target.dataset.animation = 'pop'
        e.target.addEventListener('animationend', () => e.target.dataset.animation = 'idle', { once: true })
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
        nextBox.addEventListener('animationend', () => setBoxAnimationState(nextBox, 'idle'), { once: true })
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
        boxes.forEach(box => {
            box.dataset.animation = "shake"
            setTimeout(() => boxes.forEach(box => box.dataset.animation = "idle"), SHAKE_DURATION)
        })
        allowInput()
        return
    }

    // gather all letters
    const submission = boxes.reduce((word, box) => word + box.dataset.letter, "")

    // unknown word animation
    if (dictionary && !dictionary.includes(submission)) {
        createAlert("Unknown word")
        boxes.forEach(box => {
            box.dataset.animation = "shake"
            setTimeout(() => boxes.forEach(box => box.dataset.animation = "idle"), SHAKE_DURATION)
        })
        allowInput()
        return
    }

    if (getSavedData()?.hardMode && checkWinner) {
        let error = false
        const correctedBoxes = board.querySelectorAll('[data-state="correct"]')
        const letterPresentBoxes = board.querySelectorAll('[data-state="present"]')
        for (let i = 0; i < correctedBoxes.length; i++) {
            const correctBox = correctedBoxes[i]
            const correctBoxIndex = [...board.children].indexOf(correctBox) % 5
            if (boxes[correctBoxIndex].textContent !== correctBox.textContent) {
                error = true
                createAlert(`Word must contain "${correctBox.textContent.toUpperCase()}" at position ${correctBoxIndex + 1}`)
                break
            }
        }
        for (let i = 0; i < letterPresentBoxes.length; i++) {
            if (error) break
            const letter = letterPresentBoxes[i].textContent
            if (!boxes.filter(box => box.textContent === letter).length) {
                error = true
                createAlert(`Guess must contain "${letter.toUpperCase()}"`)
                break
            }
        }
        if (error) {
            allowInput()
            return
        }
    }

    checkWinner && AutoSaveToLocalStorage() // save data to local storage

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
                if (!checkWinner && getEmptyBoxes().length !== 0) {
                    allowInput()
                } else if (checkWinner && index === boxes.length - 1) {
                    if ((boxes.filter(box => box.dataset.state === 'correct')).length === 5) {
                        // show notification with a random wish
                        createAlert(allWishes[Math.round(Math.random() * (allWishes.length - 1))], 5000)

                        boxes.forEach((box, i) => {
                            setTimeout(() => {
                                box.dataset.animation = "bounce"
                                box.addEventListener('animationend', () => boxes.forEach(box => box.dataset.animation = "idle"), { once: true })
                            }, 100 * i)
                        })

                        const savedData = getSavedData()
                        const currentStreak = savedData?.lastWordleWon === dayIndex ?
                            savedData.currentStreak + 1 : 1;
                        const maxStreak = savedData?.maxStreak ? (savedData.maxStreak < currentStreak ? currentStreak : savedData.maxStreak)
                            : currentStreak;

                        // make guess distribution
                        const guessDistribution = savedData?.guessDistribution || {}
                        const guessArray = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth']
                        const todaysGuess = guessArray[5 - (getEmptyBoxes().length / 5)]
                        guessDistribution[todaysGuess] = guessDistribution[todaysGuess] + 1 || 1;

                        // save all data in local storage
                        saveDataInLocalStorage({
                            wordlePlayed: savedData?.wordlePlayed + 1 || 1,
                            wordleWinCount: savedData?.wordleWinCount + 1 || 1,
                            lastWordleWon: dayIndex + 1, wonToday: true,
                            currentStreak, maxStreak, guessDistribution
                        })

                        setTimeout(showStatistics, 4000) // show statistics modal after 5s
                    }
                    // check if any chances left or not
                    else if (getEmptyBoxes().length === 0) {
                        // show Notification if no chance left
                        createAlert(`Today's word is "${todaysWord.toUpperCase()}"`, 5000)

                        setTimeout(showStatistics, 4000) // show statistics modal after 4s

                        saveDataInLocalStorage({
                            wordlePlayed: getSavedData()?.wordlePlayed + 1 || 1,
                            currentStreak: 0
                        })
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
function getSavedData() {
    return JSON.parse(localStorage.getItem("user-data"))
}
// save data to local storage
function saveDataInLocalStorage(data) {
    const savedData = getSavedData() || {}
    const newData = { ...savedData, ...data }
    localStorage.setItem('user-data', JSON.stringify(newData))
}


function getFromLocalStorage() {
    const savedData = getSavedData()

    // nothing happens if no saved data found
    if (!savedData) return

    const { letters } = savedData
    const previousDate = new Date(savedData.lastPlayedDate)
    const currentDate = new Date()

    // if the data is from another day nothing will be done
    if (currentDate.getDate() !== previousDate.getDate()) {
        saveDataInLocalStorage({ wonToday: false })
        return
    }

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
    (!getEmptyBoxes().length || getSavedData()?.wonToday) && setTimeout(showStatistics, 2000)
}


function AutoSaveToLocalStorage() {
    const filledBoxes = [...board.querySelectorAll(':not(.box[data-state="empty"])')]
    const letters = filledBoxes.map(box => box.dataset.letter)
    const date = Date.now()
    const previousData = getSavedData() || {}
    saveDataInLocalStorage({ ...previousData, letters, lastPlayedDate: date })
}



// modal close listener
function openModal(elements) {
    modal.style.display = 'flex'
    modal.dataset.animation = 'fade-in'
    modal.appendChild(elements)
    document.body.style.overflow = 'hidden'
    document.querySelector('main').style.filter = 'blur(5px)'
    document.querySelector('header').style.filter = 'blur(5px)'

    modal.addEventListener('click', () => {
        modal.dataset.animation = 'fade-out'
        document.body.style.overflow = ''
        document.querySelector('main').style.filter = ''
        document.querySelector('header').style.filter = ''
        modal.addEventListener('animationend', () => {
            modal.style.display = 'none'
            while (modal.lastChild) {
                modal.removeChild(modal.lastChild)
            }
        }, { once: true })
    }, { once: true })
}
