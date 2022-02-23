
getSavedData()?.darkMode === false && toggleDarkMode(false)
getSavedData()?.highContrastMode === true && toggleHighContrastMode(true)

// toggle dark mode
function toggleDarkMode(status) {
    const htmlClassList = document.querySelector('html').classList
    const darkModeStatus = status !== undefined ? status : ![...htmlClassList].includes('dark')

    darkModeStatus ? htmlClassList.add('dark') : htmlClassList.remove('dark')

    const savedData = getSavedData()
    const newData = savedData ? { ...savedData, darkMode: darkModeStatus }
        : { darkMode: darkModeStatus }
    localStorage.setItem('user-data', JSON.stringify(newData))


    document.querySelector('.toggle-dark-mode').innerHTML = darkModeStatus ? `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
            <path d="M47.48,8.69A29,29,0,0,0,40,4.08a1,1,0,0,0-1.24,1.46A27.7,27.7,0,0,1,36.6,38.22,27,27,0,0,1,3.45,45.28a1,1,0,0,0-1.17.19,1,1,0,0,0-.16,1.18A29.54,29.54,0,0,0,9,55.05a29.08,29.08,0,0,0,18.91,7c.86,0,1.73,0,2.61-.11A29.83,29.83,0,0,0,50.94,51.11,30.35,30.35,0,0,0,47.48,8.69Z"/>
        </svg>`
        : `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path
                d="M4.069 13h-4.069v-2h4.069c-.041.328-.069.661-.069 1s.028.672.069 1zm3.034-7.312l-2.881-2.881-1.414 1.414 2.881 2.881c.411-.529.885-1.003 1.414-1.414zm11.209 1.414l2.881-2.881-1.414-1.414-2.881 2.881c.528.411 1.002.886 1.414 1.414zm-6.312-3.102c.339 0 .672.028 1 .069v-4.069h-2v4.069c.328-.041.661-.069 1-.069zm0 16c-.339 0-.672-.028-1-.069v4.069h2v-4.069c-.328.041-.661.069-1 .069zm7.931-9c.041.328.069.661.069 1s-.028.672-.069 1h4.069v-2h-4.069zm-3.033 7.312l2.88 2.88 1.415-1.414-2.88-2.88c-.412.528-.886 1.002-1.415 1.414zm-11.21-1.415l-2.88 2.88 1.414 1.414 2.88-2.88c-.528-.411-1.003-.885-1.414-1.414zm6.312-10.897c-3.314 0-6 2.686-6 6s2.686 6 6 6 6-2.686 6-6-2.686-6-6-6z" />
        </svg>`
}


function toggleHighContrastMode(status) {
    const htmlClassList = document.querySelector('html').classList;

    const highContrastMode = status !== undefined ? status : ![...htmlClassList].includes('high-contrast')

    highContrastMode ? htmlClassList.add('high-contrast') : htmlClassList.remove('high-contrast')

    const savedData = getSavedData()
    const newData = savedData ? { ...savedData, highContrastMode }
        : { highContrastMode }
    localStorage.setItem('user-data', JSON.stringify(newData))
}