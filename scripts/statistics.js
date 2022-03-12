
function wordleShare() {
    let text = `Wordle-SRT ${dayIndex + 1} ${!getSavedData()?.wonToday ? 'X' : 6 - getEmptyBoxes().length / 5}/6 \n`;
    board.querySelectorAll('.box:not([data-state="empty"])').forEach((box, index) => {
        switch (box.dataset.state) {
            case 'correct':
                text += '🟩'; break;
            case 'present':
                text += '🟨'; break;
            case 'wrong':
                text += '⬛'; break;
        }
        if (!((index + 1) % 5)) text += `\n`
    })
    if (navigator.share) {
        navigator.share({
            text: 'Hello World'
        }).then(res => alert(res))
            .catch(err => alert(err))
        return
    }
    navigator.clipboard.writeText(text).then(res => console.log(res))
}
function showStatistics() {
    const { wordlePlayed, wordleWinCount, currentStreak, maxStreak, wonToday } = getSavedData() || {}

    const nextWordleTimeLeft = () => {
        const nextWordleIn = (dayIndex + 1) * 1000 * 60 * 60 * 24 + releaseDate.valueOf() - Date.now(0)
        const hours = Math.floor(nextWordleIn / (1000 * 60 * 60))
        const minutes = Math.floor(nextWordleIn / (1000 * 60) - hours * 60)
        const seconds = Math.floor(nextWordleIn / 1000 - minutes * 60 - hours * 3600)
        const countDownTime = `${hours}:${minutes}:${seconds}`

        const htmlElement = document.querySelector('.countdown > time')
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

    const statistics = `<h3>Statistics</h3>
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
        ${(!getEmptyBoxes().length || wonToday) ?
            `<hr>
            <div class="footer">
                <div class="countdown">
                    <h3>Next Wordle</h3>
                    <time></time>
                </div>
                <div class="share">
                    <button onClick="wordleShare()">Share</button>
                </div>
            </div>`
            : ``}
    `

    container.innerHTML = statistics
    openModal(container)
    nextWordleTimeLeft()
}