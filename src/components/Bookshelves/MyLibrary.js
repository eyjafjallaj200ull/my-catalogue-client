import React, {Component} from "react";
import Loading from "../Loading/Loading"
import {storeContext} from "../../utils/storeContext"
import { observer } from "mobx-react"
import {toJS} from "mobx"
import { Link } from 'react-router-dom';

@observer
class MyLibrary extends Component {
    render() {
        const {authData, bookshelfClick} = this.context;
        const {bookshelves} = toJS(authData);
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