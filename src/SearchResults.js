import React, {Component} from 'react';
import {storeContext} from "./storeContext"
import { observer } from "mobx-react"
import {toJS} from "mobx"
import Loading from './Loading'
import {Link} from "react-router-dom"

@observer
class SearchResults extends Component {
    componentDidMount() {
        const {match: {params}} = this.props;
        fetch(`https://www.googleapis.com/books/v1/volumes?q=${params.searchTerm}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        })
        .then(res => res.json())
        .then(data => {
            this.context.populateSearchResults(data);
        })
    }
    render() {
        const searchResults = toJS(this.context.searchResults);
        if(searchResults) {
            return (
                <ul>
                    {searchResults.map(item => <li onClick={() => this.context.bookClick(item.volumeInfo)} key={item.id}><Link to={`/books/${item.id}`}>{item.volumeInfo.title}</Link></li>)}
                </ul>
        )} else {
            return <Loading />
        }
    }
}

SearchResults.contextType = storeContext;
export default SearchResults;