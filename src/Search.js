import React, {Component} from "react";
import {storeContext} from "./storeContext"
import { observer } from "mobx-react"
import {toJS} from "mobx"
import {Link} from "react-router-dom"

//move handleSubmit to SearchResults component

@observer
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ""
        }
    }
    handleChange = (event) => {
        this.setState({
            searchTerm: event.target.value
        })
    }
    render() {
        return (
            <div>
                <form>
                    <input type="text" onChange={this.handleChange} />
                    <Link to={`/search/${this.state.searchTerm}`}>
                        Search
                    </Link>
                </form>
            </div>
        )
    }
}

Search.contextType = storeContext;
export default Search;