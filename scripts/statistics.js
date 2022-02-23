
function showStatistics() {
    const { wordlePlayed, wordleWinCount, currentStreak, maxStreak } = getSavedData() || {}

    const container = document.createElement('div')
    container.setAttribute('id', 'statistics-container')

    const statistics = `<h2>Statistics</h2>
    <div class="player-statistics">
        <div class="state-data">
            <span class="data" data-wordle-played>${wordlePlayed || 0}</span>
            <span class="data-title">Played</span>
        </div>
        <div class="state-data">
            <span class="data" data-wordle-played>${wordleWinCount / wordlePlayed * 100 || 0}</span>
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
    </div>`

    container.innerHTML = statistics
    openModal(container)
}