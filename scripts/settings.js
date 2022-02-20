
const overlayContainer = document.getElementById('overlay-container')

function setOverlayContainerAnimation(animationName, animationEndFunction) {
    overlayContainer.dataset.animation = animationName
    overlayContainer.addEventListener('animationend', () => {
        delete overlayContainer.dataset.animation
        animationEndFunction && animationEndFunction()
    }, { once: true })
}




JSON.parse(localStorage.getItem('user-data'))?.darkMode === false && toggleDarkMode(false)
// toggle dark mode
function toggleDarkMode(status) {
    const htmlClassList = document.querySelector('html').classList;
    const darkModeStatus = status !== undefined ? status : ![...htmlClassList].includes('dark')

    darkModeStatus ? htmlClassList.add('dark') : htmlClassList.remove('dark')

    const savedData = JSON.parse(localStorage.getItem('user-data'))
    const newData = savedData ? { ...savedData, darkMode: darkModeStatus }
        : { darkMode: darkModeStatus }
    localStorage.setItem('user-data', JSON.stringify(newData))


    document.querySelector('.toggle-dark-mode.icon').innerHTML = darkModeStatus ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path d="M47.48,8.69A29,29,0,0,0,40,4.08a1,1,0,0,0-1.24,1.46A27.7,27.7,0,0,1,36.6,38.22,27,27,0,0,1,3.45,45.28a1,1,0,0,0-1.17.19,1,1,0,0,0-.16,1.18A29.54,29.54,0,0,0,9,55.05a29.08,29.08,0,0,0,18.91,7c.86,0,1.73,0,2.61-.11A29.83,29.83,0,0,0,50.94,51.11,30.35,30.35,0,0,0,47.48,8.69Z"/>
        </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm6.312-10.897c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" />
        </svg>`
}


function hideSettings() {
    setOverlayContainerAnimation('fade-out', () => {
        while (overlayContainer.children.length > 1) {
            overlayContainer.removeChild(overlayContainer.lastChild)
        }
        overlayContainer.style.display = "none"
    })
}

function revealSettings() {
    const container = document.createElement('div')
    container.setAttribute('id', 'settings-container')
    const content = `
        <h2>Settings</h2>
        <div class="settings-body">
            <div class="toggle-body">
                <span>Dark theme</span>
                <button class="toggle-dark-mode" onclick="toggleDarkMode()" title="Toggle dark mode">
                    <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd">
                        <path
                            d="M6 18h12c3.311 0 6-2.689 6-6s-2.689-6-6-6h-12.039c-3.293.021-5.961 2.701-5.961 6 0 3.311 2.688 6 6 6zm12-10c-2.208 0-4 1.792-4 4s1.792 4 4 4 4-1.792 4-4-1.792-4-4-4z" />
                    </svg>
                </button>
            </div>
        </div>
        <footer>
            <div class="copyright-text">
                ©️ 2022
                <a href="https://sr-tamim.vercel.app" target="_blank">
                    Saifur Rahman Tamim
                </a>
            </div>
            <div class="social-links">
                <a href="https://github.com/sr-tamim/wordle-srt" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                </a>
                <a href="https://twitter.com/SR__Tamim" target="_blank">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <path
                            d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                </a>
            </div>
        </footer>
    `

    container.innerHTML = content
    overlayContainer.style.display = 'flex'
    setOverlayContainerAnimation('zoom-in')
    overlayContainer.appendChild(container)
}