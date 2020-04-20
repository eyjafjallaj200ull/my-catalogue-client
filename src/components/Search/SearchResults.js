import React from 'react';
import { observer } from "mobx-react"
import {toJS} from "mobx"
import Loading from '../Loading/Loading'
import {Link} from "react-router-dom"
import useStore from "../../utils/useStore"

const SearchResults = observer(()=> {
    const store = useStore()
    const searchResults = store.searchResults;
    if(searchResults) {
        return (
            <ul>
                {searchResults.map(item => <li key={item.id}><Link className="lightblue" to={`/books/${item.id}`}>{item.volumeInfo.title}</Link></li>)}
            </ul>
    )} else {
        return <Loading />
    }
})
export default SearchResults; 