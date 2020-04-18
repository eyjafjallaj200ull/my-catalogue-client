import React, {Component} from "react";
import Loading from "./Loading"
import {storeContext} from "./storeContext"
import { observer } from "mobx-react"
import {toJS} from "mobx"
import Bookshelf from "./Bookshelf";
import { Route, Link, BrowserRouter as Router, Switch } from 'react-router-dom';

@observer
class MyLibrary extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         bookshelfClick: this.props.bookshelfClick,
    //         bookshelves: this.props.bookshelves
    //     }
    // }
    // shouldComponentUpdate(nextProps) {
    //     return nextProps.bookshelves !== this.state.bookshelves;
    // }
    render() {
        const {authData, bookshelfClick} = this.context;
        const {bookshelves} = toJS(authData);
        console.log(bookshelves)
        return(
            bookshelves ?   
                <div id="my-library">
                    <ul>
                    {
                        bookshelves.filter(shelf => shelf.id != 5 && shelf.id != 6 && shelf.id != 9).map(shelf => <li onClick={() => bookshelfClick(shelf.title)} key={shelf.id}><Link className="lightblue" to={`/bookshelves/${shelf.id}`}>{shelf.title}</Link></li>)
                    }
                    </ul>
                </div>
        : <Loading />
        )
    }
}

MyLibrary.contextType = storeContext
export default MyLibrary;