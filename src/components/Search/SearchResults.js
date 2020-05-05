import React from 'react';
import { observer } from "mobx-react"
import {toJS} from "mobx"
import Loading from '../Loading/Loading'
import {Link} from "react-router-dom"
import useStore from "../../utils/useStore"

const SearchResults = observer(()=> {
    const store = useStore()
    const searchResults = toJS(store.searchResults);
    if(searchResults && searchResults.length > 0) {
        return (
            <ul>
                {searchResults.map(item => <li key={item.id}><Link className="lightblue" to={`/books/${item.id}`}>{item.volumeInfo.title}</Link></li>)}
            </ul>
    )} else if(searchResults && searchResults.length === 0) {
        return <h5>No results found.</h5>
    } else {
        return <Loading />
    }
})
export default SearchResults; 