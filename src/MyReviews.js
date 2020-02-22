import React, {Component} from "react";
import { observer } from "mobx-react";
import { storeContext } from "./storeContext";
import { toJS } from "mobx";
import Loading from "./Loading";
import {API_URL} from "./config";
import Review from "./Review";

const fetchMyReviews = (userId, callback) => {
    return fetch(`${API_URL}/myreviews?userId=${userId}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(res => res.json())
    .then(reviews => callback(reviews))
    .catch(err => console.error(err))
}

@observer
class MyReviews extends Component {
    constructor(props) {
        super(props);
        this.state = {
          editClicked: false,
          editReviewId: null
        }
    }
    componentDidMount() {
        fetchMyReviews(this.context.authData.id, this.context.populateMyReviews)
    }
    deleteReview = (reviewId, callback) => {
        return fetch(`${API_URL}/review`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({reviewId})
        })
        .then(res => res.status === 204 ? callback(this.context.authData.id, this.context.populateMyReviews) : console.log("something went wrong"))
        .catch(err => console.error(err))
    }
    editReview = (reviewId) => {
        this.setState({
          editClicked: true,
          editReviewId: reviewId
        })
    }
    
    onEditSubmit = () => {
        this.setState({
          editClicked: false,
          editReviewId: null
        })
    }
    render() {
        const {editClicked, editReviewId} = this.state;
        const myReviews = toJS(this.context.myReviews);
        if(myReviews) {
            return (
                <div>
                    <ul>
                    {
                        myReviews.map((review => {
                            if(editClicked && editReviewId === review.id) {
                                return <Review fetchMyReviews={fetchMyReviews} parent="myreviews" onEditSubmit={this.onEditSubmit} key={review.id} reviewId={review.id} reviewContent={review.content} volumeId={review.bookid} userId={review.userid} firstName={this.context.authData.firstName} />
                            }
                            return (
                            <li key={review.id}>
                                <p>{review.content}</p>
                                <span>on {review.timestamp}</span>
                                <button onClick={() => this.deleteReview(review.id, fetchMyReviews)}>Delete</button>
                                <button onClick={() => this.editReview(review.id)}>Edit</button>
                            </li>
                            )
                        }))
                    }
                    </ul>
                </div>
            )
        } else {
            return <Loading />
        }
    }
}

MyReviews.contextType = storeContext;
export default MyReviews;