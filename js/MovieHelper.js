export default class MovieHelper {
  constructor() {
    this.api_root = "https://api.themoviedb.org/3";
    this.api_key = "6d86a2175c01f3eb4825fb5fc418fc33";
  }

  async searchMovies(query, year = "") {
    const url = new URL(`${this.api_root}/search/movie`);
    url.searchParams.append("api_key", this.api_key);
    url.searchParams.append("query", query);
    if (year) url.searchParams.append("year", year);

    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  }

  async getMovieDetails(movie_id) {
    const url = `${this.api_root}/movie/${movie_id}?api_key=${this.api_key}`;
    const res = await fetch(url);
    return await res.json();
  }

  async getMovieCredits(movie_id) {
    const url = `${this.api_root}/movie/${movie_id}/credits?api_key=${this.api_key}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.cast || [];
  }

  async discoverMovies(year = "", genreId = "") {
    const url = new URL(`${this.api_root}/discover/movie`);
    url.searchParams.append("api_key", this.api_key);
    if (year) url.searchParams.append("primary_release_year", year);
    if (genreId) url.searchParams.append("with_genres", genreId);

    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  }

  async getGenres() {
    const url = `${this.api_root}/genre/movie/list?api_key=${this.api_key}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.genres || [];
  }

  async discoverByGenre(genreId) {
    const url = `${this.api_root}/discover/movie?api_key=${this.api_key}&with_genres=${genreId}`;
    const res = await fetch(url);
    const data = await res.json();
    return data.results || [];
  }

  async rateMovie(movie_id, rating) {
    const guestSession = await fetch(
      `${this.api_root}/authentication/guest_session/new?api_key=${this.api_key}`
    );
    const { guest_session_id } = await guestSession.json();

    const url = `${this.api_root}/movie/${movie_id}/rating?api_key=${this.api_key}&guest_session_id=${guest_session_id}`;
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify({ value: rating })
    });

    return await res.json();
  }
}
