
const board = document.getElementById('letter-board')

allowInput()
function allowInput() {
    document.getElementById('keyboard').addEventListener('click', (e) => e.target.dataset.key && processInput(e.target.dataset.key))

    document.addEventListener('keyup', (e) => (e.key.match(/^[a-z]$/) || e.key === "Enter" || e.key === "Backspace") && processInput(e.key))
}

function processInput(key) {
    const activeBoxes = [...board.querySelectorAll('.box.active')]
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
        console.log(emptyBox, key)
    }
}

function processDelete() {
    const activeBoxes = [...board.querySelectorAll('.box.active')]
    const lastBox = activeBoxes.pop()
    lastBox.textContent = ""
    delete lastBox.dataset.letter
    lastBox.classList.remove('active')
}

function processSubmit() {
    const activeBoxes = [...board.querySelectorAll('[data-letter]')]
    const submission = activeBoxes.reduce((word, box) => box.dataset.letter + word, "")
    console.log(dictionary.includes(submission))
}