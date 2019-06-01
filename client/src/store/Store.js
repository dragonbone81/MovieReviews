import {decorate, configure, observable, action, computed, runInAction} from 'mobx'

configure({enforceActions: "observed"});
const SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : 'http://localhost:3001';
const THE_MOVIE_DB_API_KEY = "fcc3ab2f52e7f8a50a7091103280a7fe";
const OM_DB_API_KEY = "54fbdc06";
const THE_MOVIE_DB_URL = "//api.themoviedb.org/3";
const OM_DB_URL = "//www.omdbapi.com";
const THE_MOVIE_DB_IMAGE_URL = "//image.tmdb.org/t/p";

class Store {
    constructor() {
        this.syncWithLocalStorage();
    }

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
    getMovieInfo = (movie_id) => {
        return fetch(`${THE_MOVIE_DB_URL}/movie/${movie_id}?api_key=${THE_MOVIE_DB_API_KEY}&language=en-US&append_to_response=credits`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => console.log(e));
    };
    searchForMovies = (search_q, page = 1) => {
        return fetch(`${THE_MOVIE_DB_URL}/search/movie?api_key=${THE_MOVIE_DB_API_KEY}&query=${encodeURIComponent(search_q)}&page=${page}&include_adult=false`, {
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
    getUsersMovieDetail = (movie_id) => {
        return fetch(`${SERVER_URL}/user/movie`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
            body: JSON.stringify({movie_id: movie_id}),
        })
            .then(response => response.json())
            .then(response => response.movie)
            .catch(e => console.log(e))
    };
    updateMovieUserData = (movie_id, type, value) => {
        return fetch(`${SERVER_URL}/user/movie/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
            body: JSON.stringify({movie_id, type, value}),
        })
            .then(response => response.json())
            .then(response => response.movie)
            .catch(e => console.log(e))
    };
    updateMovieUserDataReview = (movie_id, date_watched, review) => {
        return fetch(`${SERVER_URL}/user/movie/update/date_content`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "token": this.user.token,
            },
            body: JSON.stringify({movie_id, date_watched, review}),
        })
            .then(response => response.json())
            .then(response => response.movie)
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