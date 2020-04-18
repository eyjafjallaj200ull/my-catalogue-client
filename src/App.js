/*todo
popup, authing, searchbox, profile,
books -reading, have read, to read,
book component that shows review, rating and other info  */

import React, {Component} from 'react';
import OAuth from "./OAuth";
import { notify } from 'react-notify-toast'
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';
import Loading from './Loading'
import MyLibrary from "./MyLibrary"
import api from './api'
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
import {socket, provider} from "./utils/auth"
//import './App.css';

//get header outside of container


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
    socket.on("connect", () => {
      this.setState({loading: false})
      //const authToken = getToken()
      /*if(user) {
        store.addAllAuthData(user);
      }*/
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
              <Header logout={this.logout}/>              
              <div className='container'>
                {this.state.loading
                  ? <Loading /> 
                  :
                  
                    
                    <Switch>
                      <Route exact path="/bookshelves" component={MyLibrary} />
                      <Route exact path="/myreviews" component={MyReviews} />
                      <Route path="/bookshelves/:bookshelfId" render={(props) => (
                        <Bookshelf key={props.match.params.bookshelfId} socket={socket} {...props} />)} />
                      <Route exact path="/books/:bookId" component={Book} />
                      <Route exact path="/search/:searchTerm" component={SearchResults} />
                    </Switch>
                  
                }
              </div>
          </div>
        </Router>
      </storeContext.Provider>
    )
  }
}
