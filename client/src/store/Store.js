import {decorate, configure, observable, action, computed, runInAction} from 'mobx'

configure({enforceActions: "observed"});
const SERVER_URL = process.env.REACT_APP_SERVER_URL ? process.env.REACT_APP_SERVER_URL : 'http://localhost:3001';
const THE_MOVIE_DB_API_KEY = "fcc3ab2f52e7f8a50a7091103280a7fe";
const OM_DB_API_KEY = "54fbdc06";
const THE_MOVIE_DB_URL = "//api.themoviedb.org/3";
const OM_DB_URL = "//www.omdbapi.com";
const THE_MOVIE_DB_IMAGE_URL = "//image.tmdb.org/t/p";

class Store {
    constructor() {
        this.syncWithLocalStorage();
    }

    vernikoff_ratings = [
        "So bad it's good 😶",
        "TEEEEEAARIBLE 😔",
        "Mehhh 😐",
        "Pretty good 🙂",
        "Amazing! 😄",
        "Best movie ever made 😋"
    ];
    poster_sizes = [
        "w92",
        "w154",
        "w185",
        "w342",
        "w500",
        "w780",
        "original"
    ];
    user = {};
    updateLocalStorage = () => {
        localStorage.setItem("user", JSON.stringify(this.user));
    };
    syncWithLocalStorage = () => {
        const user = localStorage.getItem("user");
        if (user !== "undefined" && user) {
            this.user = JSON.parse(user);
        }
    };

    get userLoggedIn() {
        return ('username' in this.user && 'token' in this.user);
    };

    userSignUp = (data) => {
        return fetch(`${SERVER_URL}/signUp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({user: data}),
        })
            .then(response => response.json())
            .then(response => {
                if (!('error' in response)) {
                    runInAction(() => {
                        this.user = response.user;
                        this.updateLocalStorage();
                    });
                }
                return response
            })
            .catch(e => console.log(e))
    };
    userLogin = (data) => {
        return fetch(`${SERVER_URL}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({user: data}),
        })
            .then(response => response.json())
            .then(response => {
                if (!('error' in response)) {
                    runInAction(() => {
                        this.user = response.user;
                        this.updateLocalStorage();
                    });
                }
                return response
            })
            .catch(e => console.log(e))
    };
    getDirectors = (credits) => {
        if (!credits)
            return [];
        return credits.crew.filter(option => option.job === "Director");
    };
    getImageURL = (image_path, size = "original") => {
        return `${THE_MOVIE_DB_IMAGE_URL}/${size}/${image_path}`
    };
    viewedOrReviewed = (userMovieData) => {
        return userMovieData.viewed || userMovieData.review || userMovieData.date_watched;
    };
    getMovieInfo = (movie_id, credits = true, similar = true) => {
        return fetch(`${THE_MOVIE_DB_URL}/movie/${movie_id}?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&append_to_response=${credits && "credits"},${similar && "similar"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                console.log(e);
                return {};
            });
    };
    getPopularMovieInfo = () => {
        return fetch(`${THE_MOVIE_DB_URL}/movie/popular?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&region=USA`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                console.log(e);
                return {};
            });
    };
    getPopularShowInfo = () => {
        return fetch(`${THE_MOVIE_DB_URL}/tv/popular?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                console.log(e);
                return {};
            });
    };
    getShowInfo = (show_id, credits = true, similar = true) => {
        return fetch(`${THE_MOVIE_DB_URL}/tv/${show_id}?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&append_to_response=${credits && "credits"},${similar && "similar"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                console.log(e);
                return {};
            });
    };
    getSeasonInfo = (show_id, season, credits = true) => {
        return fetch(`${THE_MOVIE_DB_URL}/tv/${show_id}/season/${season}?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&append_to_response=${credits && "credits"}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                console.log(e);
                return {};
            });
    };
    getActorInfo = (actor_id) => {
        return fetch(`${THE_MOVIE_DB_URL}/person/${actor_id}?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&append_to_response=combined_credits`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                console.log(e);
                return {};
            });
    };
    getStudioInfo = (studio_id, page) => {
        return fetch(`${THE_MOVIE_DB_URL}/discover/movie?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_companies=${studio_id}&page=${page || 1}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                console.log(e);
                return {};
            });
    };
    getNetworkInfo = (network_id, page) => {
        return fetch(`${THE_MOVIE_DB_URL}/discover/tv?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&sort_by=popularity.desc&page=1&timezone=America%2FNew_York&with_networks=${network_id}&include_null_first_air_dates=false&page=${page || 1}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => {
                console.log(e);
                return {};
            });
    };
    // throttled = (delay, fn) => {
    //     let lastCall = 0;
    //     return function (...args) {
    //         const now = (new Date).getTime();
    //         if (now - lastCall < delay) {
    //             return;
    //         }
    //         lastCall = now;
    //         return fn(...args);
    //     }
    // };
    getMultipleMovies = (movies, all = false) => {
        return Promise.all(movies.map(movie => {
            if (movie.poster_path === "" || movie.release_date === "" || movie.title === "") {
                delete movie.poster_path;
                delete movie.release_date;
                delete movie.title;
                if (movie.type === "movie") {
                    return this.getMovieInfo(movie.movie_id, false).then(api_movie => {
                        this.updateMoviePoster(movie.movie_id, movie.season, movie.type, api_movie.poster_path, api_movie.release_date, api_movie.title);
                        return all ? {...api_movie, ...movie} : {poster_path: api_movie.poster_path, ...movie}
                    })
                }
                if (movie.type === "tv") {
                    return this.getShowInfo(movie.movie_id, false).then(api_movie => {
                        this.updateMoviePoster(movie.movie_id, movie.season, movie.type, api_movie.poster_path, api_movie.first_air_date, api_movie.name);
                        return all ? {...api_movie, ...movie} : {poster_path: api_movie.poster_path, ...movie}
                    })
                }
                if (movie.type === "season") {
                    return this.getSeasonInfo(movie.movie_id, movie.season, false).then(api_movie => {
                        this.updateMoviePoster(movie.movie_id, movie.season, movie.type, api_movie.poster_path, api_movie.air_date, api_movie.name);
                        return all ? {...api_movie, ...movie} : {poster_path: api_movie.poster_path, ...movie}
                    })
                }
                else {
                    return console.log("ERROR");
                }
            } else {
                if (movie.type === "tv") {
                    movie.first_air_date = movie.release_date;
                    movie.name = movie.title;
                }
                if (movie.type === "season") {
                    movie.air_date = movie.release_date;
                    movie.name = movie.title;
                }
                return movie;
            }
        }));
    };
    updateMoviePoster = (movie_id, season, type, poster_path, release_date, title) => {
        // return fetch(`${SERVER_URL}/add_poster`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json",
        //         "token": this.user.token,
        //     },
        //     body: JSON.stringify({movie_id, season, type, poster_path, release_date, title}),
        // })
        //     .then(response => response.json())
        //     .then(response => response.movie)
        //     .catch(e => console.log(e))
    };
    searchForMovies = (search_q, page = 1) => {
        return fetch(`${THE_MOVIE_DB_URL}/search/multi?api_key=${THE_MOVIE_DB_API_KEY}&query=${encodeURIComponent(search_q)}&page=${page}&include_adult=false`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => console.log(e));
    };
    getMovieInfoOMDB = (movie_id) => {
        return fetch(`${OM_DB_URL}/?i=${movie_id}&apikey=${OM_DB_API_KEY}`, {
            method: "GET",
            headers: {
                // "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => console.log(e));
    };
    getUsersEntityDetail = (id, type, season = null) => {
        return fetch(`${SERVER_URL}/user/movie/${encodeURIComponent(id)}?type=${type}${season ? `&season=${season}` : ""}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
            // body: JSON.stringify({movie_id: movie_id}),
        })
            .then(response => response.json())
            .then(response => response.movie)
            .catch(e => console.log(e))
    };
    getUsersMovieReview = (movie_id, username, type, season) => {
        return fetch(`${SERVER_URL}/user/review/${encodeURIComponent(movie_id)}/${encodeURIComponent(username)}?type=${type}&season=${season}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
        })
            .then(response => response.json())
            .then(response => response.movie)
            .catch(e => console.log(e))
    };
    getRecentReviews = (type) => {
        return fetch(`${SERVER_URL}/recent/reviews?type=${type}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
        })
            .then(response => response.json())
            .then(response => response.movie)
            .catch(e => console.log(e))
    };
    updateMovieUserData = (movie_id, type, value, entityType, poster_path, release_date, title, season = null) => {
        return fetch(`${SERVER_URL}/user/movie/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
            body: JSON.stringify({movie_id, type, value, entityType, season, poster_path, release_date, title}),
        })
            .then(response => response.json())
            .then(response => response.movie)
            .catch(e => console.log(e))
    };
    updateMovieUserDataReview = (movie_id, date_watched, review, type, season, poster_path, release_date, title) => {
        return fetch(`${SERVER_URL}/user/movie/update/date_content`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
            body: JSON.stringify({movie_id, date_watched, review, type, season, poster_path, release_date, title}),
        })
            .then(response => response.json())
            .then(response => response.movie)
            .catch(e => console.log(e))
    };
    updateMovieVReview = (movie_id, v_review, type, season) => {
        return fetch(`${SERVER_URL}/user/movie/update/v_review`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
            body: JSON.stringify({movie_id, v_review, type, season}),
        })
            .then(response => response.json())
            .then(response => response.movie)
            .catch(e => console.log(e))
    };
    getViewedMoviesForUser = (username, page = 0, sortType, sortDirection, typeSort) => {
        return fetch(`${SERVER_URL}/user/movies/watched/${encodeURIComponent(username)}?page=${page}&sort_type=${sortType}&sort_direction=${sortDirection}&type=${typeSort}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({movie_id, date_watched, review}),
        })
            .then(response => response.json())
            .then(response => response.movies)
            .catch(e => console.log(e))
    };
    getSavedMoviesForUser = (username, page = 0, sortType, sortDirection, typeSort) => {
        return fetch(`${SERVER_URL}/user/movies/saved/${encodeURIComponent(username)}?page=${page}&sort_type=${sortType}&sort_direction=${sortDirection}&type=${typeSort}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({movie_id, date_watched, review}),
        })
            .then(response => response.json())
            .then(response => response.movies)
            .catch(e => console.log(e))
    };
    getHistoryMoviesForUser = (username, page = 0, sortType, sortDirection, typeSort) => {
        return fetch(`${SERVER_URL}/user/movies/history/${encodeURIComponent(username)}?page=${page}&sort_type=${sortType}&sort_direction=${sortDirection}&type=${typeSort}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({movie_id, date_watched, review}),
        })
            .then(response => response.json())
            .then(response => response.movies)
            .catch(e => console.log(e))
    };
    getVratedMovies = (page = 0, sortType, sortDirection, typeSort) => {
        return fetch(`${SERVER_URL}/vrated?page=${page}&sort_type=${sortType}&sort_direction=${sortDirection}&type=${typeSort}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({movie_id, date_watched, review}),
        })
            .then(response => response.json())
            .then(response => response.movies)
            .catch(e => console.log(e))
    };
    getReviewMoviesForUser = (username, page = 0, sortType, sortDirection, typeSort) => {
        return fetch(`${SERVER_URL}/user/movies/reviews/${encodeURIComponent(username)}?page=${page}&sort_type=${sortType}&sort_direction=${sortDirection}&type=${typeSort}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
            // body: JSON.stringify({movie_id, date_watched, review}),
        })
            .then(response => response.json())
            .then(response => response.movies)
            .catch(e => console.log(e))
    };
    getRatings = (data) => {
        const ratings = {};
        data.Ratings.forEach(rating => {
            if (rating.Source === "Internet Movie Database") {
                ratings.imdb = rating.Value;
            }
            if (rating.Source === "Rotten Tomatoes") {
                ratings.rt = rating.Value;
            }
        });
        return ratings;
    };
}

decorate(Store, {
    userSignUp: action,
    user: observable,
    userLoggedIn: computed,

});
export default new Store()