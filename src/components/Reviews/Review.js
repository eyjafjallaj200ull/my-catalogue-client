import React, {Component} from "react";
import {API_URL} from "../../config";
import { storeContext } from "../../utils/storeContext";
import API from "../../utils/api"

class Review extends Component {
    constructor(props) {
        super(props);
        this.state = {
            review: "",
            isEditComponent: false
        }
    }
    componentDidMount () {
        if(this.props.reviewContent) {
            this.setState({
                review: this.props.reviewContent,
                isEditComponent: true
            })
        }
    }
    handleChange = (event) => {
        this.setState({
            review: event.target.value
        })
    }
    handleSubmit = (event) => {
        if(this.state.review)
        {if(this.state.isEditComponent) {
            API.editReview(this.state.review, this.props.reviewId)
            .then((res) => {
                if(res.status === 204) {
                    if(this.props.parent === "reviews") {
                        API.fetchReviews(this.props.volumeId, this.context.authData.id, this.context.populateReviews); 
                    }
                    else if(this.props.parent === "myreviews") {
                        API.fetchMyReviews(this.context.authData.id, this.context.populateMyReviews)
                    }
                    this.props.onEditSubmit()
                } else {
                    console.log("something went wrong")
                }
            })
            .catch(err => console.error(err))
        } else 
        {
            API.addReview(this.props.userId, this.props.firstName, this.state.review, this.props.volumeId, this.props.bookTitle)
            .then((res) => {
                if(res.status === 204) {
                    this.context.addNewReview(this.props.volumeId, this.context.authData.id, this.context.populateReviews)
                    this.setState({
                        review: ""
                    })
                }
                else {
                    console.log("something went wrong")
                }
            })
            .catch(err => console.log(err))
            }}
        event.preventDefault();
    }
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <textarea className="textarea-class" placeholder="Write a review..." value={this.state.review} onChange={this.handleChange} />
                    <input className="submit-review mx-1 px-3 py-1" type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
}

Review.contextType = storeContext;
export default Review;