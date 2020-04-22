import React, {Component} from "react";
import Review from "./Review";
import { observer } from "mobx-react";
import { storeContext } from "../../utils/storeContext";
import { toJS } from "mobx";
import Loading from "../Loading/Loading";
import {API_URL} from "../../config";
import API from "../../utils/api"

@observer
class Reviews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editClicked: false,
      editReviewId: null
    }
  }
  componentDidMount() {
    API.fetchReviews(this.props.volumeId, this.context.authData.id, this.context.populateReviews)
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

  deleteReview = (reviewId, callback) => {
    API.deleteReview(reviewId)
    .then(res => res.status === 204 ? callback(this.props.volumeId, this.context.authData.id, this.context.populateReviews) : console.log("something went wrong"))
    .catch(err => console.error(err))
}

  render() {
    const {volumeId, userId, firstName, bookTitle} = this.props;
    const {editClicked, editReviewId} = this.state;
    const reviews = toJS(this.context.reviews);
    return (
      <div>
      <Review bookTitle={bookTitle} volumeId={volumeId} userId={userId} firstName={firstName} />
      {reviews ? 
          <ul>
            {
              reviews.map((review => {
                if(editClicked && editReviewId === review.id) {
                  return <Review parent="reviews" onEditSubmit={this.onEditSubmit} key={review.id} reviewId={review.id} reviewContent={review.content} volumeId={volumeId} userId={userId} firstName={firstName} bookTitle={bookTitle} />
                } else {
                  return (<li key={review.id}>
                    <div className="review reviews">
                      <div className="review-body">
                        <p>{review.content}</p>
                        <h4>by {review.username}</h4>
                        <span className="date">on {review.timestamp}</span>
                      </div>

                      { review.isUserReview ?
                      <div>
                        <button className="mx-1 px-3 py-1 delete-review" onClick={() => this.deleteReview(review.id, this.context.fetchReviews)}>Delete</button>
                        <button className="mx-1 px-3 py-1 edit-review" onClick={() => this.editReview(review.id)}>Edit</button>
                      </div>
                      : ""
                      }
                    </div>
                </li>)}
              }))
            }
          </ul>
        : <Loading />
      } 
      </div>
    )
  }
}

Reviews.contextType = storeContext;
export default Reviews;