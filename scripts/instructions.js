{
    const instructions = `<p>Guess the <b>WORDLE</b> in 6 tries.</p>
    <p>Each guess must be a valid 5 letter word. Hit the enter button to submit.</p>
    <p>
        After each guess, the color of the tiles will change to show how close your guess was to the word.
    </p>
    <hr>
    <h4>Examples</h4>
    <div class="instruction-boxes">
        <div class="box" data-state="correct">w</div>
        <div class="box">e</div>
        <div class="box">a</div>
        <div class="box">r</div>
        <div class="box">y</div>
    </div>
    <p>The letter <b>W</b> is in the word and in the correct spot.</p>
    <div class="instruction-boxes">
        <div class="box">p</div>
        <div class="box" data-state="present">i</div>
        <div class="box">l</div>
        <div class="box">l</div>
        <div class="box">s</div>
    </div>
    <p>The letter <b>I</b> is in the word but in the wrong spot.</p>
    <div class="instruction-boxes">
        <div class="box">v</div>
        <div class="box">a</div>
        <div class="box">g</div>
        <div class="box" data-state="wrong">u</div>
        <div class="box">e</div>
    </div>
    <p>The letter <b>U</b> is not in the word in any spot.</p>
    <hr>
    <h2>A new WORDLE will be available each day!</h2>
</p>`

    const newUser = !localStorage.getItem('user-data')?.lastPlayedDate
    newUser && showInstructions()

    function showInstructions() {
        const container = document.createElement('div')
        container.setAttribute('id', 'instructions-container')

        container.innerHTML = instructions
        const boxesWithState = [...container.querySelectorAll('[data-state]')]
        setTimeout(() => {
            boxesWithState.forEach(box => {
                box.dataset.animation = 'flip-in'
                box.addEventListener('animationend', () => {
                    box.dataset.animation = 'flip-out'
                    box.addEventListener('animationend', () => delete box.dataset.animation)
                }, { once: true })
            })
        }, 1000)

        const modal = document.getElementById('modal-container')
        modal.style.display = 'flex'
        modal.dataset.animation = 'zoom-in'
        modal.appendChild(container)
    }


    function showInstructionsOverlay() {
        const container = document.createElement('div')
        container.setAttribute('id', 'instructions-container')

        container.innerHTML = `<h1>How to play</h1><hr>` + instructions
        const boxesWithState = [...container.querySelectorAll('[data-state]')]
        setTimeout(() => {
            boxesWithState.forEach(box => {
                box.dataset.animation = 'flip-in'
                box.addEventListener('animationend', () => {
                    box.dataset.animation = 'flip-out'
                    box.addEventListener('animationend', () => delete box.dataset.animation)
                }, { once: true })
            })
        }, 1000)

        overlayContainer.style.display = 'flex'
        setOverlayContainerAnimation('zoom-in')
        overlayContainer.appendChild(container)
    }
}