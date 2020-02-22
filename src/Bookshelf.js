/* TO DO:
receive shelf.id, shelf title as props
this.state books
componentDidMount calls the bookshelf-call in the server and changes state
iterate through books and show them in a list
onClick should render Book component
item.id should be passed as prop to Book
*/
import React, {Component} from "react";
import {API_URL} from "./config";
import Book from "./Book.js";
import {storeContext} from "./storeContext"
import { observer } from "mobx-react"
import {toJS} from "mobx"
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

@observer
class Bookshelf extends Component {
  componentDidMount() {
    this.context.removeBooks();
    const { match: { params } } = this.props;
    fetch(`${API_URL}/bookshelf?bookshelfId=${params.bookshelfId}&userId=${this.context.authData.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(resp => resp.json())
      .then(data => {console.log(data); this.context.addBooks(data)})
      .catch(err => console.log(err)) 
  }
  componentWillUnmount() {
    this.context.removeBooks();
  }
  removeBook = (shelfId, volumeId) => {
    fetch(`${API_URL}/volume/remove?userId=${this.context.authData.id}`, {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({shelfId, volumeId})
  })
  .then(() => {
    this.context.removeBooks();
    const { match: { params } } = this.props;
    fetch(`${API_URL}/bookshelf?bookshelfId=${params.bookshelfId}&userId=${this.context.authData.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then(resp => resp.json())
      .then(data => {console.log(data); this.context.addBooks(data)})
      .catch(err => console.log(err)) 
  })
  }

  render() {
    const { match: { params } } = this.props;
    console.log(toJS(this.context.authData).bookshelves.find(shelf => shelf.id == params.bookshelfId).title)
    const {bookshelves} = toJS(this.context.authData);
    const shelfTitle = bookshelves.find(shelf => shelf.id == params.bookshelfId).title;
    return (
        <div>
          <h1>{shelfTitle}</h1>
          {
            this.context.books ? <div>
              <ul>
              {
                toJS(this.context.books).map(item => <li onClick={() => this.context.bookClick(item.volumeInfo)} key={item.id}><Link to={`/books/${item.id}`}>{item.volumeInfo.title}</Link><button onClick={() => this.removeBook(params.bookshelfId, item.id)}>Remove from shelf</button></li>)
              }
              </ul> 
            </div> : ""
          }
        </div>
    )
  }
}

Bookshelf.contextType = storeContext;
export default Bookshelf;