import {decorate, configure, observable, action, computed, runInAction} from 'mobx'

configure({enforceActions: "observed"});
const SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : 'http://localhost:3001';

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
}

decorate(Store, {
    userSignUp: action,
    user: observable,
    userLoggedIn: computed,

});
export default new Store()