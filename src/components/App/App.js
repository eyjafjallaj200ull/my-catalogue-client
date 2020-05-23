import React, {Component} from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import Loading from '../Loading/Loading'
import MyLibrary from "../Bookshelves/MyLibrary"
import 'font-awesome/css/font-awesome.min.css';
import { observer } from "mobx-react"
import {store} from "../../stores/Store"
import {storeContext} from "../../utils/storeContext"
import {toJS} from "mobx"
import Header from '../Navigation/Header'
import Bookshelf from '../Bookshelves/Bookshelf'
import Book from '../Book/Book'
import MyReviews from"../Reviews/MyReviews"
import SearchResults from "../Search/SearchResults"
import {socket} from "../../utils/auth"
import API from "../../utils/api"
import SessionExpired from '../SessionExpired/SessionExpired';
//import './App.css';


@observer
export default class App extends Component {

  state = {
    loading: true,
  }

  componentDidMount() {
    socket.on("connect", () => {
      this.setState({loading: false})
    })
  }

  removeAuthData = () => {
    store.removeAuthData()
    localStorage.removeItem("store")
  }

  logout = () => {
    API.logout()
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
              {store.sessionIsExpired ? <SessionExpired /> : ""}             
              <div className='container'>
                {this.state.loading
                  ? <Loading /> 
                  :                    
                    <Switch>
                      <Route exact path="/bookshelves" component={MyLibrary} />
                      <Route exact path="/myreviews" component={MyReviews} />
                      <Route path="/bookshelves/:bookshelfId" render={(props) => (
                        <Bookshelf key={props.match.params.bookshelfId} {...props} />)} />
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
