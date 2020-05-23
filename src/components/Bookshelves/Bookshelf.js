import React, {Component} from "react";
import {storeContext} from "../../utils/storeContext"
import { observer } from "mobx-react"
import {toJS} from "mobx"
import API from "../../utils/api"
import { Link } from 'react-router-dom';

@observer
class Bookshelf extends Component {
  componentDidMount() {
    this.context.removeBooks();
    const { match: { params } } = this.props;
    API.fetchBooks(params.bookshelfId)
    .then(data => {
     if(data) {
       this.context.addBooks(data);
      } else {
        this.context.onSessionExpiry();
      }
    })
  }
  componentWillUnmount() {
    this.context.removeBooks();
  }
  removeBook = (shelfId, volumeId) => {
    API.removeBook(shelfId, volumeId)
    .then((message) => {
      if(message === "Success") {
        this.context.removeBooks();
        const { match: { params } } = this.props;
        API.fetchBooks(params.bookshelfId)
          .then(data => {this.context.addBooks(data)})
          .catch(err => console.log(err)) 
      } else {
        this.context.onSessionExpiry()
      }
    })
  }

  render() {
    const { match: { params } } = this.props;
    const {bookshelfId} = params;
    const {bookshelves} = toJS(this.context.authData);
    const editableShelf = bookshelfId == 0 || bookshelfId == 2 || bookshelfId == 3 || bookshelfId == 4;    
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
                  {editableShelf ? <div><button className="remove-book" onClick={() => this.removeBook(bookshelfId, item.id)}>
                    Remove from shelf
                  </button>
                  </div> : ""}
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