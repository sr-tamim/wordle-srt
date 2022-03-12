
function showStatistics() {
    const { wordlePlayed, wordleWinCount, currentStreak, maxStreak, lastPlayedDate } = getSavedData() || {}

    const nextWordleTimeLeft = () => {
        const nextWordleIn = (dayIndex + 1) * 1000 * 60 * 60 * 24 + releaseDate.valueOf() - Date.now(0)
        const hours = Math.floor(nextWordleIn / (1000 * 60 * 60))
        const minutes = Math.floor(nextWordleIn / (1000 * 60) - hours * 60)
        const seconds = Math.floor(nextWordleIn / 1000 - minutes * 60 - hours * 3600)
        const countDownTime = `${hours}:${minutes}:${seconds}`

        const htmlElement = document.querySelector('.next-wordle-time > time')
        let timeout
        if (htmlElement) {
            htmlElement.innerText = countDownTime
            timeout = setTimeout(nextWordleTimeLeft, 1000)
        } else {
            clearTimeout(timeout)
        }
        return countDownTime
    }

    const container = document.createElement('div')
    container.setAttribute('id', 'statistics-container')

    const statistics = `<h2>Statistics</h2>
    <div class="player-statistics">
        <div class="state-data">
            <span class="data" data-wordle-played>${wordlePlayed || 0}</span>
            <span class="data-title">Played</span>
        </div>
        <div class="state-data">
            <span class="data" data-wordle-played>${Math.round(wordleWinCount / wordlePlayed * 100) || 0}</span>
            <span class="data-title">Win %</span>
        </div>
        <div class="state-data">
            <span class="data" data-wordle-played>${currentStreak || 0}</span>
            <span class="data-title">Current</span>
            <span class="data-title">Streak</span>
        </div>
        <div class="state-data">
            <span class="data" data-wordle-played>${maxStreak || 0}</span>
            <span class="data-title">Max</span>
            <span class="data-title">Streak</span>
        </div>
    </div>
    <hr>
    <div>
        ${!getEmptyBoxes().length ?
            `<div class="next-wordle-time">
                <h3>Next Wordle</h3>
                <time></time>
            </div>`
            : ``}
    </div>`

    container.innerHTML = statistics
    openModal(container)
    nextWordleTimeLeft()
}