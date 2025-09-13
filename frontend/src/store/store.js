import { makeAutoObservable } from 'mobx';


class TokenStore {
    constructor() { makeAutoObservable(this); }
    token = null;

    setToken = (new_token) => {this.token = new_token;};
}

export const tokenStore = new TokenStore();