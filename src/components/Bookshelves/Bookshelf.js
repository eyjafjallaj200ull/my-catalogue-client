import React, {Component} from "react";
import {API_URL} from "../../config";
import {storeContext} from "../../utils/storeContext"
import { observer } from "mobx-react"
import {toJS} from "mobx"
import API from "../../utils/api"
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

@observer
class Bookshelf extends Component {
  componentDidMount() {
    this.context.removeBooks();
    const { match: { params } } = this.props;
    API.fetchBooks(params.bookshelfId)
    .then(data => {console.log(data); this.context.addBooks(data)})
  }
  componentWillUnmount() {
    this.context.removeBooks();
  }
  removeBook = (shelfId, volumeId) => {
    API.removeBook(shelfId, volumeId)
    .then(() => {
      this.context.removeBooks();
      const { match: { params } } = this.props;
      API.fetchBooks(params.bookshelfId)
        .then(data => {console.log(data); this.context.addBooks(data)})
        .catch(err => console.log(err)) 
    })
  }

  render() {
    const { match: { params } } = this.props;
    const {bookshelves} = toJS(this.context.authData);
    const shelfTitle = bookshelves.find(shelf => shelf.id == params.bookshelfId).title;
    return (
        <div>
          <h1>{shelfTitle}</h1>
          {
            this.context.books ? <div>
              <ul>
              {
                toJS(this.context.books)
                .map(item => {
                return (
                <li className="shelf my-2" key={item.id}>
                  <Link className="w-75 lightblue" to={`/books/${item.id}`}>{item.volumeInfo.title}</Link>
                  <div><button className="remove-book" onClick={() => this.removeBook(params.bookshelfId, item.id)}>
                    Remove from shelf
                  </button>
                  </div>
                </li>)
              })
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