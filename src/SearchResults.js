import React, {Component} from 'react';
import {storeContext} from "./storeContext"
import { observer } from "mobx-react"
import {toJS} from "mobx"
import Loading from './Loading'
import {Link} from "react-router-dom"

@observer
class SearchResults extends Component {
    render() {
        const searchResults = toJS(this.context.searchResults);
        if(searchResults) {
            return (
                <ul>
                    {searchResults.map(item => <li key={item.id}><Link className="lightblue" to={`/books/${item.id}`}>{item.volumeInfo.title}</Link></li>)}
                </ul>
        )} else {
            return <Loading />
        }
    }
}

SearchResults.contextType = storeContext;
export default SearchResults;