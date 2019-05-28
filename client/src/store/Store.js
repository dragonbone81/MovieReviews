import {decorate, configure, observable, action, computed, runInAction} from 'mobx'

configure({enforceActions: "observed"});
const SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : 'http://localhost:3001';
const THE_MOVIE_DB_API_KEY = "fcc3ab2f52e7f8a50a7091103280a7fe";
const THE_MOVIE_DB_URL = "//api.themoviedb.org/3";
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
        if (user) {
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
        return credits.crew.filter(option => option.department === "Directing");
    };
    getImageURL = (image_path, size = "original") => {
        return `${THE_MOVIE_DB_IMAGE_URL}/${size}/${image_path}`
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
}

decorate(Store, {
    userSignUp: action,
    user: observable,
    userLoggedIn: computed,

});
export default new Store()