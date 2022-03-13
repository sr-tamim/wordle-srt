
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
        navigator.share({ text }).catch(err => alert(err))
        return
    }
    navigator.clipboard.writeText(text).then(() => createAlert('Copied to clipboard', 2000))
}



function showStatistics() {
    const { wordlePlayed, wordleWinCount, currentStreak, maxStreak, wonToday, guessDistribution } = getSavedData() || {}


    function animateGuessChart() {
        // max guessed number
        const maxGuess = guessDistribution ? Math.max(...Object.values(guessDistribution)) : 0
        const chartBars = document.querySelectorAll('.chart-bar')
        chartBars.forEach(element => {
            const legendValue = guessDistribution[element.dataset.legend] || 0
            element.animate([
                { width: (legendValue / maxGuess * 100) + '%' }
            ], {
                duration: 700,
                fill: 'forwards',
                easing: 'ease-out',
                delay: 1000
            })
            for (let i = 1; i <= 20; i++) {
                setTimeout(() => element.innerText = i === 20 ? legendValue : parseInt(Math.random() * 10), 100 * i)
            }
        })
    }
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
    <div class="guess-distribution">
        <h3>Guess Distribution</h3>
        ${!guessDistribution ? `<span>No Data</span>`
            : `<div class="chart-row">
            <div class="row-legend">1</div>
            <div class="row-value">
                <div class="chart-bar" data-legend="first" >0</div>
            </div>
        </div>
        <div class="chart-row">
            <div class="row-legend">2</div>
            <div class="row-value">
                <div class="chart-bar" data-legend="second" >0</div>
            </div>
        </div>
        <div class="chart-row">
            <div class="row-legend">3</div>
            <div class="row-value">
                <div class="chart-bar" data-legend="third" >0</div>
            </div>
        </div>
        <div class="chart-row">
            <div class="row-legend">4</div>
            <div class="row-value">
                <div class="chart-bar" data-legend="fourth" >0</div>
            </div>
        </div>
        <div class="chart-row">
            <div class="row-legend">5</div>
            <div class="row-value">
                <div class="chart-bar" data-legend="fifth" >0</div>
            </div>
        </div>
        <div class="chart-row">
            <div class="row-legend">6</div>
            <div class="row-value">
                <div class="chart-bar" data-legend="sixth" >0</div>
            </div>
        </div>`}
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
    animateGuessChart()
}