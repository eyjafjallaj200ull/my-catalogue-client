import React, {Component} from "react";
import {storeContext} from "../../utils/storeContext"
import { observer } from "mobx-react"
import { withRouter } from 'react-router-dom'

@observer
class Search extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchTerm: ""
        }
    }
    handleChange = (event) => {
        this.setState({searchTerm: event.target.value})
    }
    handleKeyPress = (event) => {        
        if(event.charCode == 13 && this.state.searchTerm) {
            this.context.resetSearchResults()
            this.context.performSearch(this.state.searchTerm)
            const { history } = this.props;
            history.push(`/search/${this.state.searchTerm}`);
            this.setState({searchTerm: ""})
        }
    }
    render() {
        return (
            <div className="w-100">
                    <input 
                        className="text-center w-100 search-input py-1" 
                        type="text" 
                        onChange={(e) => this.handleChange(e)} 
                        onKeyPress={e => this.handleKeyPress(e)} 
                        placeholder="Search"
                        value={this.state.searchTerm}
                    />
            </div>
        )
    }
}

Search.contextType = storeContext;
export default withRouter(Search);