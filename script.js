const searchElement = document.getElementById('input-element')
const formElement = document.getElementById('form-element')
const movieContainer = document.querySelector('.movie-container')
const APIKey = `e821ef63690b7fcba2e1a30c4e9d59b8`
const IMAGEURL = `https://image.tmdb.org/t/p/w500`
let page = 1
let initializingURL = `https://api.themoviedb.org/3/discover/movie?page=${page}&sort_by=popularity.desc&api_key=${APIKey}`

async function initializingPage(url) {
    const response = await fetch(url)
    if (response.ok) {
        const JSONdata = await response.json()
        gettingResultFromJSON(JSONdata)
    }
    else {
        movieContainer.innerHTML = `
            <span class="error">Some Network Issues Are Arrived. Try Again...</span>
        `
    }
}

initializingPage(initializingURL)

function gettingResultFromJSON(JSONdata) {
    const result = JSONdata.results
    result.forEach((json) => {
        const { poster_path, original_title, release_date, overview } = json  //Object destructuring
        generateMovieCard(poster_path, original_title, release_date, overview)
    })
}

function generateMovieCard(poster_path, original_title, release_date, overview) {
    let posterImage = poster_path !== null ? IMAGEURL + poster_path : `notfound.jpg`
    const movieTitle = original_title.length > 10 ? original_title.slice(0, 10) + "..." : original_title
    const movieDiv = document.createElement('div')
    movieDiv.className = "movie-card"
    movieDiv.innerHTML = `
                <img src=${posterImage} alt=${movieTitle} loading="lazy">
                <div class="text-content">
                     <header>
                        <div class="title">
                            <h3>${movieTitle}</h3>
                            <span>${release_date}</span>
                        </div>
                        <div class="cover">
                            <a href="${posterImage}">
                                <button>See Cover</button>
                            </a>
                        </div>
                    </header>
                    <div class="line"></div>
                    <div class="about">
                        <p>${overview}</p>
                    </div>
                </div>
    `
    movieContainer.appendChild(movieDiv)
}

formElement.addEventListener('submit', (event) => {
    event.preventDefault()
    window.removeEventListener('scroll',loadMore)
    const query = searchElement.value
    if (query == "") {
        alert('Please Enter the Correct Movie Name!!!!!')
    }
    else {
        const searchURL = `https://api.themoviedb.org/3/search/movie?query=${query}&api_key=${APIKey}`
        movieContainer.innerHTML = ""
        initializingPage(searchURL)
    }
})

window.addEventListener('scroll',loadMore)

function loadMore(){
    page++
    initializingURL = `https://api.themoviedb.org/3/discover/movie?page=${page}&sort_by=popularity.desc&api_key=${APIKey}`
    initializingPage(initializingURL)
}