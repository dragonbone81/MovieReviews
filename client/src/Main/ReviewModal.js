import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.min.css"

class ReviewModal extends Component {
    state = {
        date: new Date(),
        review: "",
        v_rating: 0,
    };

    componentDidMount() {
        this.setState({
            date: this.props.userMovieData.date_watched ? new Date(this.props.userMovieData.date_watched) || null : null,
            review: this.props.userMovieData.review || ""
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
            date: this.props.userMovieData.date_watched ? new Date(this.props.userMovieData.date_watched) || new Date() : new Date(),
            review: this.props.userMovieData.review || ""
        });
        this.props.close();
    };
    save = () => {
        this.props.store.updateMovieUserDataReview(this.props.movie.id, this.state.date, this.state.review === "" ? null : this.state.review);
        if (this.props.store.user.username === "dragonbone81") {
            this.props.store.updateMovieVReview(this.props.movie.id, this.state.v_rating);
            this.props.updateVReview(this.state.v_rating);
        }
        this.props.updateReviewDate(this.state.review, this.state.date);
        this.props.close();
    };
    delete_review = () => {
        this.props.store.updateMovieUserDataReview(this.props.movie.id, null, null);
        this.props.updateReviewDate(null, null);
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
                                    <img width={150}
                                         src={this.props.movie.poster_path ? this.props.store.getImageURL(this.props.movie.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                         className="img-review" alt="Movie poster"/>
                                </div>
                                <div className="d-flex flex-column review-details">
                                    <span className="modal-you-watched">You watched...</span>
                                    <div className="d-flex flex-row align-items-start justify-content-start mm-ty">
                                        <span className="movie-modal-title">{this.props.movie.title}</span>

                                        <span
                                            className="movie-modal-year">{this.props.movie.release_date.substring(0, 4)}</span>
                                    </div>
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
                                                    defaultValue={this.props.userMovieData.v_rating ? this.props.userMovieData.v_rating.rating : 0}
                                                    className="form-control">
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
                                {(this.props.userMovieData.review || this.props.userMovieData.date_watched) &&
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
