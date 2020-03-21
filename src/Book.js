import React, {Component} from "react";
import Reviews from "./Reviews";
import {API_URL} from "./config";
import {storeContext} from "./storeContext"
import { observer } from "mobx-react"
import { toJS } from "mobx";
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import API from "./utils/api"
import Loading from "./Loading";

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
            dropdownOpen: false,
            info: null
        }
    }
    componentDidMount() {
        const {match: {params}} = this.props;
        API.fetchVolume(params.bookId)
        .then(volumeInfo => this.setState({info: volumeInfo}))
    }

    addToShelf = (shelfId, volumeId) => {
        fetch(`${API_URL}/volume/add?userId=${this.context.authData.id}`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({shelfId, volumeId})
        })
    }

    smoothDescription = (description) => {
        const array = description.split("");
        let indexArray = [];
        const newArray = array.filter((item, index, array) => {
            if(item === "<" || item === "/") {
                indexArray.push(index+1)
            }
            const statement = item !== "<" && item !== ">" && item !== "/" && array[index+1] !== ">" && !indexArray.includes(index);
            return statement;
        })
        return newArray.join("");
    }

    toggle = () => {
        this.setState(prevState => ({
            dropdownOpen: !prevState.dropdownOpen
        }));
    }

    render() {
        const {match: {params}} = this.props;
        const {info} = this.state;
        const authData = toJS(this.context.authData)
        const {bookshelves} = authData
        if(info) {
            return (
                <div>
                    <h1>{info.title}</h1>
                    {info.authors ? <h3>by 
                        {
                            info.authors.map((author, i) => i !== info.authors.length - 1 ? 
                            <span key={author}> {author},</span>
                            :
                            <span key={author}> {author}</span>
                            )
                        }
                    </h3> : ""}
                    {info.description ? <p>{this.smoothDescription(info.description)}</p> : ""}
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
                    <Reviews bookTitle={info.title} userId={authData.id} volumeId={params.bookId} firstName={authData.firstName} />
                </div>
            )
        } else {
            return <Loading />
        }
        
    }
}

Book.contextType = storeContext;
export default Book;