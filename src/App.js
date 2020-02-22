/*todo
popup, authing, searchbox, profile,
books -reading, have read, to read,
book component that shows review, rating and other info  */

import React, {Component} from 'react';
import io from "socket.io-client";
import OAuth from "./OAuth";
import { notify } from 'react-notify-toast'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import Loading from './Loading'
import MyLibrary from "./MyLibrary"
import api from './api'
import {API_URL} from "./config";
import { setToken, getToken, removeToken } from './utils'
import 'font-awesome/css/font-awesome.min.css';
import { observer } from "mobx-react"
import {store} from "./Store"
import {storeContext} from "./storeContext"
import {toJS} from "mobx"
import Header from './Header'
import Bookshelf from './Bookshelf'
import Book from './Book'
import MyReviews from"./MyReviews"
import SearchResults from "./SearchResults"

//import './App.css';

const socket = io(API_URL);
const provider = "google";


@observer
export default class App extends Component {

  state = {
    loading: true,
    //authData: null
  }
  
  // refreshToken = () => {
  //   api.refresh()
  //     .then(user => {
  //       //setToken(authToken)
  //       store.addAllAuthData(user)
  //     })
  //     .catch(err => {
  //       console.log(err)
  //       // pop up to say something is wrong
  //       removeToken()
  //     })
  // }

  componentDidMount() {
    socket.on("connect", (user) => {
      this.setState({loading: false})
      //const authToken = getToken()
      if(user) {
        store.addAllAuthData(user);
      }
    })
  }

  // addProviderData = (provider, providerData, email) => {
  //   this.setState({
  //     authData: {
  //       ...this.state.authData,
  //       [provider]: providerData,
  //       email
  //     }
  //   })
  // }

  // addAllAuthData = authToken => {
  //   localStorage.setItem('authToken', authToken)
  //   const authData = jwtDecode(authToken).user
  //   this.setState({ authData })
  // }

  removeAuthData = () => {
    //removeToken()
    store.removeAuthData()
    localStorage.removeItem("store")
    //notify.show(msg)
  }

  logout = () => {
    api.logout()
      .then(() => {
        this.removeAuthData()
      })
  }

  render() {
    return (
      <storeContext.Provider value={store}>
        <Router>
          <div className={"wrapper"}>
            <div className={"container"}>
              
              <div className='container'>
                {this.state.loading
                  ? <Loading /> 
                  :
                  toJS(store.authData).id ? 
                  <React.Fragment>
                    <Header logout={this.logout}/>
                    <Switch>
                      <Route exact path="/bookshelves" component={MyLibrary} />
                      <Route exact path="/myreviews" component={MyReviews} />
                      <Route path="/bookshelves/:bookshelfId" render={(props) => (
                        <Bookshelf key={props.match.params.bookshelfId} {...props} />)} />
                      <Route exact path="/books/:bookId" component={Book} />
                      <Route exact path="/search/:searchTerm" component={SearchResults} />
                    </Switch>
                  </React.Fragment>
                  : <Route exact path="/" render={() => <OAuth
                    provider={provider}
                    key={provider}
                    socket={socket}
                    />}
                    />
                }
              </div>
            </div>
          </div>
        </Router>
      </storeContext.Provider>
    )
  }
}
