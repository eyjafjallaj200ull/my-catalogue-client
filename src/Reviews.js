import React, {Component} from "react";
import Review from "./Review";
import { observer } from "mobx-react";
import { storeContext } from "./storeContext";
import { toJS } from "mobx";
import Loading from "./Loading";
import {API_URL} from "./config";
import API from "./utils/api"


//what should happen when you click edit?
/*
pass the review content to the onclick 
you will need to render the review component with its input value being the content
when you press submit you make a request to editreview in the api

**** reviews should always be displayed in order of their timestamps
*/

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
    return fetch(`${API_URL}/review`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({reviewId})
    })
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
                    <div className="review">
                  <p>{review.content}</p>
                  <h4>by {review.username}</h4>
                  <span>on {review.timestamp}</span>
                  { review.isUserReview ?
                  <React.Fragment>
                    <button onClick={() => this.deleteReview(review.id, this.context.fetchReviews)}>Delete</button>
                    <button onClick={() => this.editReview(review.id)}>Edit</button>
                  </React.Fragment>
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