let MovieHelper;

async function loadMovieHelper() {
  if (!MovieHelper) {
    const module = await import('./MovieHelper.js');
    MovieHelper = new module.default();
  }
  return MovieHelper;
}

function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}

let movieListComponent = {
  movies: [],
  search: "",
  selectedYear: "",
  years: [],
  genres: [],
  selectedGenre: "",
  selectedRuntime: "",
  runtimes: [],
  error: null,

  async init() {
    const MH = await loadMovieHelper();
    this.movies = await MH.discoverMovies();

    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1980; y--) {
      this.years.push(y);
    }

    this.genres = await MH.getGenres();
    this.runtimes = [
      { id: "0-60", label: "0–60 min" },
      { id: "61-90", label: "61–90 min" },
      { id: "91-120", label: "91–120 min" },
      { id: "121+", label: "121+ min" }
    ];
  },

  async doSearchByName() {
    const MH = await loadMovieHelper();
    if (!this.search.trim()) {
      await this.applyFilters();
      return;
    }

    const url = new URL(`${MH.api_root}/search/movie`);
    url.searchParams.append("api_key", MH.api_key);
    url.searchParams.append("query", this.search);
    if (this.selectedYear) url.searchParams.append("year", this.selectedYear);
    if (this.selectedGenre) url.searchParams.append("with_genres", this.selectedGenre);

    const parts = this.selectedRuntime.split("-");
    if (parts[0]) url.searchParams.append("with_runtime.gte", parts[0]);
    if (parts[1]) url.searchParams.append("with_runtime.lte", parts[1]);

    const res = await fetch(url);
    const data = await res.json();
    this.movies = data.results || [];
  },

  async applyFilters() {
    const MH = await loadMovieHelper();
    let runtimeGte = "";
    let runtimeLte = "";

    if (this.selectedRuntime) {
      const parts = this.selectedRuntime.split("-");
      runtimeGte = parts[0];
      runtimeLte = parts[1] || "";
    }

    const url = new URL(`${MH.api_root}/discover/movie`);
    url.searchParams.append("api_key", MH.api_key);
    if (this.selectedYear) url.searchParams.append("primary_release_year", this.selectedYear);
    if (this.selectedGenre) url.searchParams.append("with_genres", this.selectedGenre);
    if (runtimeGte) url.searchParams.append("with_runtime.gte", runtimeGte);
    if (runtimeLte) url.searchParams.append("with_runtime.lte", runtimeLte);

    const res = await fetch(url);
    const data = await res.json();
    this.movies = data.results || [];
  },

  addToWatchlist(movie) {
    let list = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (!list.find(m => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(list));
      alert(`${movie.title} added to watchlist!`);
    }
  }
};

let movieComponent = {
  movie: null,
  userRating: 0,

  async init() {
    const id = getUrlParam("movie_id");
    if (id) {
      const MH = await loadMovieHelper();
      this.movie = await MH.getMovieDetails(id);
      this.cast = await MH.getMovieCredits(id);
    }
  },

  async rateMovie(value) {
    this.userRating = value;
    const MH = await loadMovieHelper();
    const response = await MH.rateMovie(this.movie.id, value);
    if (response.success) {
      alert(`You rated ${this.movie.title} ${value}/10 ⭐`);
    } else {
      alert("Failed to submit rating, try again later.");
    }
  },

  addToWatchlist(movie) {
    let list = JSON.parse(localStorage.getItem("watchlist") || "[]");
    if (!list.find(m => m.id === movie.id)) {
      list.push(movie);
      localStorage.setItem("watchlist", JSON.stringify(list));
      alert(`${movie.title} added to watchlist!`);
    }
  }
};

let watchlistComponent = {
  watchlist: [],

  init() {
    this.watchlist = JSON.parse(localStorage.getItem("watchlist") || "[]");
  },

  remove(id) {
    this.watchlist = this.watchlist.filter(m => m.id !== id);
    localStorage.setItem("watchlist", JSON.stringify(this.watchlist));
  }
};
