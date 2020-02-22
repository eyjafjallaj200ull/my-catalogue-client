import React, {Component} from "react";
import {API_URL} from "./config";
import { storeContext } from "./storeContext";

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
        if(this.state.isEditComponent) {
            fetch(`${API_URL}/review`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({content: this.state.review, id: this.props.reviewId})
            })
            .then((res) => {
                if(res.status === 204) {
                    if(this.props.parent === "reviews") {
                        this.context.fetchReviews(this.props.volumeId, this.context.authData.id, this.context.populateReviews); 
                    }
                    else if(this.props.parent === "myreviews") {
                        this.props.fetchMyReviews(this.context.authData.id, this.context.populateMyReviews)
                    }
                    this.props.onEditSubmit()
                } else {
                    console.log("something went wrong")
                }
            })
            .catch(err => console.error(err))
        } else 
        {
            fetch(`${API_URL}/review`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({userid: this.props.userId, username: this.props.firstName, content: this.state.review, bookid: this.props.volumeId})
        })
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
        }
        event.preventDefault();
    }
    render() {
        //textarea, submit button
        //handleSubmit is a function that takes the textarea value and adds username userid volumeid and the val and 
        //calls api which handles the db
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <textarea value={this.state.review} onChange={this.handleChange} />
                    <input type="submit" value="Submit"/>
                </form>
            </div>
        )
    }
}

Review.contextType = storeContext;
export default Review;