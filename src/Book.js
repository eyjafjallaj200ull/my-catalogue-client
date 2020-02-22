import React, {Component} from "react";
import Reviews from "./Reviews";
import {API_URL} from "./config";
import {storeContext} from "./storeContext"
import { observer } from "mobx-react"
import { toJS } from "mobx";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

//try passing volume title to reviews

@observer
class Book extends Component {
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         volumeInfo: {}
    //     }
    // }
    // componentDidMount() {
    //     fetch(`${API_URL}/volume`, {
    //         method: "POST",
    //         headers: {
    //           "Content-Type": "application/json"
    //         },
    //         body: JSON.stringify({volumeId: this.props.volumeId})
    //       })
    //     .then(res => {
    //         return fetch(`${API_URL}/volume`, {
    //         method: "GET",
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     })
    //         .then(resp => resp.json())
    //         .then(data => this.setState({volumeInfo: data}))
    //         .catch(err => console.log(err))
    //         })
    //     .catch(err => console.log(err))
    // }
    constructor(props) {
        super(props);
        this.state = {
            dropdownOpen: false
        }
    }

    addToShelf = (shelfId, volumeId) => {
        fetch(`${API_URL}/volume/add?userId=${this.context.authData.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({shelfId, volumeId})
        })
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        const {match: {params}} = this.props;
        const volume = toJS(this.context.volume);
        const authData = toJS(this.context.authData)
        const {bookshelves} = authData
        return (
            <div>
                <h1>{volume.info.title}</h1>
                <h3>by 
                    {
                        volume.info.authors.map((author, i) => i !== volume.info.authors.length - 1 ? 
                        <span key={author}> {author},</span>
                        :
                        <span key={author}> {author}</span>
                        )
                    }
                </h3>
                <p>{volume.info.description}</p>
                    <Dropdown direction="left" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                        <DropdownToggle
                        tag="div"
                        data-toggle="dropdown"
                        aria-expanded={this.state.dropdownOpen}
                        >
                            Add to Library
                        </DropdownToggle>
                        <DropdownMenu>
                            {
                                bookshelves.filter(shelf => shelf.id === 0 || shelf.id === 2 || shelf.id === 3 || shelf.id === 4 )
                                .map(shelf => {
                                    return (
                                        <DropdownItem key={shelf.id} onClick={() => this.addToShelf(shelf.id, params.bookId)}>
                                            {shelf.title}
                                        </DropdownItem>
                                    )
                                })
                            }
                        </DropdownMenu>
                    </Dropdown>
                <Reviews userId={authData.id} volumeId={params.bookId} firstName={authData.firstName} />
            </div>
        )
    }
}

Book.contextType = storeContext;
export default Book;