let MovieHelper

async function loadMovieHelper() {
    if (!MovieHelper) {
        const module = await import('./MovieHelper.js')
        MovieHelper = new module.default()
    }
    return MovieHelper
}

function getUrlParam(param) {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(param)
}

let movieListComponent = {
    movies: [],
    search: "",
    search_year: "",
    error: null,

    async init() {
        const MH = await loadMovieHelper()
        this.movies = await MH.discoverMovies()
    },

    // Search by movie name
    async doSearchByName() {
        const MH = await loadMovieHelper()
        if (!this.search.trim()) {
            alert("Please enter a movie name.")
            return
        }
        this.movies = await MH.searchMovies(this.search)
    },

    // Search by year only
    async doSearchByYear() {
        const MH = await loadMovieHelper()
        if (!this.search_year.trim()) {
            alert("Please enter a year.")
            return
        }
        this.movies = await MH.discoverMovies(this.search_year)
    },

    addToWatchlist(movie) {
        let list = JSON.parse(localStorage.getItem("watchlist") || "[]")
        if (!list.find(m => m.id === movie.id)) {
            list.push(movie)
            localStorage.setItem("watchlist", JSON.stringify(list))
            alert(`${movie.title} added to watchlist!`)
        }
    }
}

let movieComponent = {
    movie: null,
    async init() {
        const id = getUrlParam("movie_id")
        if (id) {
            const MH = await loadMovieHelper()
            this.movie = await MH.getMovieDetails(id)
        }
    },
    addToWatchlist(movie) {
        let list = JSON.parse(localStorage.getItem("watchlist") || "[]")
        if (!list.find(m => m.id === movie.id)) {
            list.push(movie)
            localStorage.setItem("watchlist", JSON.stringify(list))
            alert(`${movie.title} added to watchlist!`)
        }
    }
}

let watchlistComponent = {
    watchlist: [],
    init() {
        this.watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]")
    },
    remove(id) {
        this.watchlist = this.watchlist.filter(m => m.id !== id)
        localStorage.setItem("watchlist", JSON.stringify(this.watchlist))
    }
}
