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
  error: null,

  async init() {
    const MH = await loadMovieHelper();
    this.movies = await MH.discoverMovies();

    const currentYear = new Date().getFullYear();
    for (let y = currentYear; y >= 1980; y--) {
      this.years.push(y);
    }

    this.genres = await MH.getGenres();
  },

  async doSearchByName() {
    const MH = await loadMovieHelper();
    if (!this.search.trim()) {
      await this.applyFilters();
      return;
    }
    this.movies = await MH.searchMovies(this.search, this.selectedYear);
  },

  async applyFilters() {
    const MH = await loadMovieHelper();
    this.movies = await MH.discoverMovies(this.selectedYear, this.selectedGenre);
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
