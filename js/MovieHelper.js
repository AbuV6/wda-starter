export default class MovieHelper {
    constructor() {
        this.api_root = "https://api.themoviedb.org/3"
        this.api_key = "6d86a2175c01f3eb4825fb5fc418fc33"
    }

    async searchMovies(query, year = "") {
        const url = new URL(`${this.api_root}/search/movie`)
        url.searchParams.append("api_key", this.api_key)
        url.searchParams.append("query", query)
        if (year) url.searchParams.append("year", year)

        const res = await fetch(url)
        const data = await res.json()
        return data.results || []
    }

    async getMovieDetails(movie_id) {
        const url = `${this.api_root}/movie/${movie_id}?api_key=${this.api_key}`
        const res = await fetch(url)
        return await res.json()
    }

    async discoverMovies(year = "") {
        const url = new URL(`${this.api_root}/discover/movie`)
        url.searchParams.append("api_key", this.api_key)
        if (year) url.searchParams.append("primary_release_year", year)

        const res = await fetch(url)
        const data = await res.json()
        return data.results || []
    }
}
