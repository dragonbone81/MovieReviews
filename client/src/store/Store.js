import {decorate, configure, observable, action, computed, runInAction} from 'mobx'

configure({enforceActions: "observed"});
const SERVER_URL = process.env.SERVER_URL ? process.env.SERVER_URL : 'http://localhost:3001';

class Store {
    userSignUp = (data) => {
        return fetch(`${SERVER_URL}/signUp`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({user: data}),
        })
            .then(response => response.json())
            .then(response => response)
            .catch(e => console.log(e))
    }
}

decorate(Store, {});
export default new Store()