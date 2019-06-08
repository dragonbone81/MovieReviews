import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.min.css"
import ImageWithLoading from '../Misc/ImageWithLoading';
import {toast} from 'react-toastify';

class ReviewModal extends Component {
    state = {
        date: new Date(),
        review: "",
        v_rating: -1,
    };

    componentDidMount() {
        this.setState({
            date: this.props.userData.date_watched ? new Date(this.props.userData.date_watched) || null : null,
            review: this.props.userData.review || ""
        });
        document.addEventListener('mousedown', this.click, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.click, false);
    }

    click = (e) => {
        if (!this.modal.contains(e.target)) {
            this.props.close();
        }
    };
    cancel = () => {
        this.setState({
            date: this.props.userData.date_watched ? new Date(this.props.userData.date_watched) || null : null,
            review: this.props.userData.review || ""
        });
        this.props.close();
    };
    save = () => {
        this.props.store.updateMovieUserDataReview(this.props.movie.id, this.state.date, this.state.review === "" ? null : this.state.review, this.props.type);
        if (this.props.store.user.username === "dragonbone81" && this.state.v_rating !== -1) {
            this.props.store.updateMovieVReview(this.props.movie.id, this.state.v_rating, this.props.type);
            this.props.updateVReview(this.state.v_rating);
        }
        this.props.updateReviewDate(this.state.review, this.state.date);
        toast.info("💾 Review Saved", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
        this.props.close();
    };
    delete_review = () => {
        this.props.store.updateMovieUserDataReview(this.props.movie.id, null, null, this.props.type);
        this.props.updateReviewDate(null, null);
        toast.info("❌ Review Deleted", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
        this.setState({date: null, review: ""});
        this.props.close();
    };

    render() {
        return (
            <div>
                {this.props.open && <div className="backdrop"/>}
                <div
                    className={this.props.open ? "modal-made-trans scale-up-center" : "modal-made-close slide-out-right"}
                    id="modal" ref={el => {
                    this.modal = el;
                }}>
                    {this.props.movie && (
                        <div className="review-modal-content">
                            <div className="d-flex flex-row movie-review-row">
                                <div>
                                    <ImageWithLoading type={this.props.type} width={150}
                                                      imgStyle="img-review"
                                                      src={this.props.store.getImageURL(this.props.movie.poster_path, this.props.store.poster_sizes[3])}/>
                                </div>
                                <div className="d-flex flex-column review-details">
                                    <span className="modal-you-watched">You watched...</span>
                                    {this.props.type === "movie" && (
                                        <div className="d-flex flex-row align-items-start justify-content-start mm-ty">

                                            <span className="movie-modal-title">{this.props.movie.title}</span>

                                            <span
                                                className="movie-modal-year">{this.props.movie.release_date.substring(0, 4)}</span>
                                        </div>
                                    )}
                                    {this.props.type === "tv" && (
                                        <div className="d-flex flex-row align-items-start justify-content-start mm-ty">

                                            <span className="movie-modal-title">{this.props.movie.name}</span>

                                            <span
                                                className="movie-modal-year">{this.props.movie.first_air_date.substring(0, 4)}</span>
                                        </div>
                                    )}
                                    <div>
                                        <span className="modal-date-on">On:</span>
                                        <DatePicker
                                            placeholderText="Click to select a date"
                                            className="date-choosing"
                                            selected={this.state.date}
                                            onChange={(date) => this.setState({date})}
                                            maxDate={new Date()}
                                        />
                                        {this.props.store.user.username === "dragonbone81" && (
                                            <div className="form-group pt-2">
                                                <label>Vernikoff Rating</label>
                                                <select
                                                    onChange={({target}) => this.setState({v_rating: parseInt(target.value)})}
                                                    defaultValue={this.props.userData.v_rating ? this.props.userData.v_rating.rating : -1}
                                                    className="form-control">
                                                    <option
                                                        key={-1} value={-1}/>
                                                    {this.props.store.vernikoff_ratings.map((v, i) =>
                                                        <option
                                                            key={i} value={i}>{v}</option>
                                                    )}
                                                </select>
                                            </div>
                                        )}
                                    </div>
                                    <textarea value={this.state.review}
                                              onChange={({target}) => this.setState({review: target.value})}
                                              className="review-text" rows="3" placeholder="Your review..."/>
                                </div>
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <button onClick={this.save} type="button"
                                        className="btn btn-success submit-review">Save
                                </button>
                                <button onClick={this.cancel} type="button"
                                        className="mr-2 btn btn-warning submit-review">Cancel
                                </button>
                                {(this.props.userData.review || this.props.userData.date_watched) &&
                                <button onClick={this.delete_review} type="button"
                                        className="mr-auto btn btn-danger submit-review">Delete Review
                                </button>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(ReviewModal)));
