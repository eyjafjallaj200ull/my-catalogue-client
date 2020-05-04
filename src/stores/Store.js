import { observable, action, autorun, set, toJS, runInAction } from 'mobx';
//import jwtDecode from 'jwt-decode'
import {API_URL} from "../config";
import { thisExpression } from '@babel/types';
import API from "../utils/api"

const autoSave = (_this) => {
    let firstRun = true

	// will run on change
	autorun(() => {
		// on load check if there's an existing store on localStorage and extend the store
		if (firstRun) {
			const existingStore = JSON.parse(localStorage.getItem("store"))

			if (existingStore) {
				set(_this, existingStore)
			}
		}

		// from then on serialize and save to localStorage
		localStorage.setItem("store", JSON.stringify(toJS(_this)))
	})

	firstRun = false
}


class Store {

    constructor() {
        autoSave(this);
    }

    @observable
    sessionIsExpired = false;

    @observable 
    authData = {
        name: null,
        id: null,
        bookshelves: null,
        firstName: null
    }

    @observable 
    bookshelf = {
        title: null
    }

    @observable
    books = null;

    @observable
    volume = {
        info: null
    }

    @observable
    reviews = null;

    @observable
    myReviews = null;

    @observable
    addedNewReview = false;

    @observable
    searchResults = null;

    @action
    reset = () => {
        this.authData = {
            name: null,
            email: null,
            bookshelves: null,
            firstName: null
        }
        this.bookshelf = {
            title: null
        }
        this.books = null;
        this.volume = {
            info: null
        }
        this.reviews = null;
        this.searchResults = null;
        this.sessionIsExpired = false;
    }

    @action 
    onSessionExpiry = () => {
        this.sessionIsExpired = true;
    }

    @action
    addAllAuthData = (user) => {
        this.authData = user;
    }

    @action
    removeAuthData = () => {
        this.authData = null;
        this.reset()
    }

    @action 
    bookshelfClick = (title) => {
        this.bookshelfClicked = true;
        this.bookshelf = {
            title
        }
    }

    @action
    addBooks = (books) => {
        this.books = books;
    }

    @action
    bookClick = (info) => {
        this.bookClicked = true;
        this.volume = {
            info
        }
    }

    @action 
    removeBooks = () => {
        this.books = null;
        this.reviews = null;
    }

    @action
    populateReviews = (reviews) => {
        this.reviews = reviews;
    }

    @action
    populateMyReviews = (reviews) => {
        this.myReviews = reviews;
    }

    @action 
    fetchReviews = (volumeId, email, callback) => {
        API.fetchReviews(volumeId, email, callback).then(() => {
            runInAction(() => {
                this.addedNewReview = false;
            })
        })
        .catch(err => console.error(err));
    }

    @action
    addNewReview = (volumeId, email, callback) => {
        this.addedNewReview = true;
        this.fetchReviews(volumeId, email, callback);
    }

    @action 
    resetSearchResults = () => {
        this.searchResults = null;
    }

    @action 
    performSearch = (searchTerm) => {
        API.performSearch(searchTerm)
        .then(data => {
            runInAction(() => {
                this.searchResults = data.items
            })
        })
    }

}

export const store = new Store();
