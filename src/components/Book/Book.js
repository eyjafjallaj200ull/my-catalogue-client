import React, {Component} from "react";
import Reviews from "../Reviews/Reviews";
import {storeContext} from "../../utils/storeContext"
import { observer } from "mobx-react"
import { toJS } from "mobx";
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import API from "../../utils/api"
import Loading from "../Loading/Loading";


@observer
class Book extends Component {
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
        API.addToShelf(shelfId, volumeId);
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
                        {
                            authData.id ?
                            <React.Fragment>
                                <ButtonDropdown className="add-to-library" direction="left" isOpen={this.state.dropdownOpen} toggle={this.toggle}>
                                    <DropdownToggle
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
                                </ButtonDropdown>
                                <Reviews bookTitle={info.title} userId={authData.id} volumeId={params.bookId} firstName={authData.firstName} />
                            </React.Fragment>
                            : 
                            <div>
                                <h5>Please log in to make reviews and more.</h5>
                            </div>
                        }
                    
                </div>
            )
        } else {
            return <Loading />
        }
        
    }
}

Book.contextType = storeContext;
export default Book;