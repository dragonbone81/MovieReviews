import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Loader from '../Misc/Loader';
import RatingComponent from '../Misc/Rating';
import ReviewModal from './ReviewModal';
import ImageWithLoading from '../Misc/ImageWithLoading';
import {toast} from 'react-toastify';
import {
    BarChart, Bar, YAxis
} from 'recharts';


class ShowPage extends Component {
    state = {
        showData: {},
        userShowData: {},
        loadingData: false,
        reviewModalOpen: false,
    };
    normalizeRatings = (ratings) => {
        const ratingGroups = ratings.map(rating => ({rating: parseInt(rating.rating), count: parseInt(rating.count)}));
        const min = Math.min.apply(Math, ratingGroups.map(e => e.count));
        for (let i = 1; i < 10; i++) {
            if (!ratingGroups.some(e => e.rating === i)) {
                ratingGroups.push({rating: i, count: min / 100})
            }
        }
        ratingGroups.sort((a, b) => a.rating - b.rating);
        return ratingGroups;
    };
    updateWithNewShow = async () => {
        this.setState({loadingData: true});
        const {show_id} = this.props.match.params;
        let showData = this.props.store.getShowInfo(show_id);
        // let userMovieData = this.props.store.getUsersMovieDetail(movie_id);
        // const result = await Promise.all([movieData, userMovieData]);
        showData = await showData;
        // movieData = result[0];
        // userMovieData = result[1];
        // if (userMovieData) {
        //     userMovieData.rating_groups = this.normalizeRatings(userMovieData.rating_groups);
        //     userMovieData.max_one_rating = Math.max.apply(Math, userMovieData.rating_groups.map(e => e.count));
        // }
        document.title = showData.name;
        // const OMDB_data = await this.props.store.getMovieInfoOMDB(movieData.imdb_id);
        // if (OMDB_data.Response === "False") {
        //     movieData.ratings = [];
        // } else {
        //     movieData.ratings = this.props.store.getRatings(OMDB_data);
        // }
        // this.setState({showData: movieData || {}, userShowData: userMovieData || {}}, () => {
        //     this.setState({loadingData: false});
        // });
        showData.ratings = {};
        this.setState({showData}, () => {
            this.setState({loadingData: false})
        });
    };

    // async componentDidUpdate(prevProps, prevState, snapshot) {
    //     if (prevProps.match.params.movie_id !== this.props.match.params.movie_id) {
    //         this.updateWithNewMovie();
    //     }
    // }

    async componentDidMount() {
        this.updateWithNewShow();
    }

    updateMovieUserData = (type, val) => {
        let message;
        if (type === "liked") {
            if (val) {
                message = "🙂 Movie Liked"
            } else {
                message = "🙁 Movie Unliked"
            }
        }
        if (type === "viewed") {
            if (val) {
                message = "🙉 Movie Viewed"
            } else {
                message = "🙈 Movie Unviewed"
            }
        }
        if (type === "saved") {
            if (val) {
                message = "💾 Movie Saved"
            } else {
                message = "🚫 Movie Removed"
            }
        }
        toast.info(message, {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
        this.props.store.updateMovieUserData(this.state.showData.id, type, val);
        const updatedState = {...this.state.userShowData};
        updatedState[type] = val;
        this.setState({userShowData: updatedState})
    };
    updateReviewDate = (review, date_watched) => {
        this.setState(prevState => ({userShowData: {...prevState.userShowData, review, date_watched}}))
    };
    updateVReview = (v_rating) => {
        if (v_rating !== -1) {
            this.setState(prevState => ({userShowData: {...prevState.userShowData, v_rating: {rating: v_rating}}}))
        }
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        if (Object.entries(this.state.showData).length > 0)
            return (
                <div className="movie-page-full">
                    {/*<ReviewModal updateVReview={this.updateVReview} updateReviewDate={this.updateReviewDate}*/}
                    {/*userMovieData={this.state.userShowData}*/}
                    {/*movie={this.state.showData}*/}
                    {/*open={this.state.reviewModalOpen}*/}
                    {/*close={() => this.setState({reviewModalOpen: false})}/>*/}
                    <div
                        style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.showData.backdrop_path)})`}}
                        className="movie-backdrop"/>
                    <div className="mr-1 ml-1 movie-content d-flex flex-row justify-content-center">
                        <div className="movie-poster d-flex flex-column mr-2">
                            <ImageWithLoading width={250}
                                              imgStyle="movie-page-poster"
                                              src={this.props.store.getImageURL(this.state.showData.poster_path, this.props.store.poster_sizes[3])}/>
                            <div className="d-flex flex-row justify-content-between ratings mt-2">
                                <div className="d-flex flex-row mr-1">
                                    <img className="mr-1" height={25}
                                         src="//i.imgur.com/2Sle5QI.png"/>
                                    <span>{this.state.showData.ratings.imdb || "N/A"}</span>
                                </div>
                                <div className="d-flex flex-row">
                                    {this.state.showData.ratings.rt ?
                                        parseInt(this.state.showData.ratings.rt.slice(0, -1)) < 60 ?
                                            <img className="mr-1" height={25}
                                                 src="//i.imgur.com/6oR2eKa.png"/>
                                            :
                                            <img className="mr-1" height={25}
                                                 src="//i.imgur.com/FugNdUf.png"/>
                                        : <img className="mr-1" height={25}
                                               src="//i.imgur.com/FugNdUf.png"/>
                                    }
                                    <span>{this.state.showData.ratings.rt || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="movie-info d-flex flex-column">
                            <div className="d-flex flex-row align-items-center movie-title-d-y">
                                <div className="movie-title">{this.state.showData.name}</div>
                                <div className="movie-director-year">
                                    Created
                                    by {this.state.showData.created_by.map((creator, i, arr) => {
                                    return (
                                        <span key={creator.id}>{creator.name}{arr.length - 1 !== i && (
                                            <span>, </span>)}</span>
                                    )
                                })} | <span>{this.state.showData.first_air_date.substring(0, 4)}</span>
                                </div>
                            </div>
                            <div className="d-flex flex-row">
                                <div className="d-flex flex-column align-items-start">
                                    <div className="tag-line">{this.state.showData.tagline}</div>
                                    <div className="move-description-detail">{this.state.showData.overview}</div>
                                </div>
                                <div className="d-flex flex-column">
                                    {this.props.store.user.token ?
                                        <div style={{
                                            minHeight: this.state.userShowData.v_rating ? 400 : 300,
                                            maxHeight: this.state.userShowData.v_rating ? 400 : 300
                                        }} className="movie-actions d-flex flex-column">
                                            <div
                                                className="d-flex flex-row movie-actions-icons justify-content-between">
                                                <div
                                                    className="d-flex flex-column align-items-center movie-actions-icon"
                                                    onClick={() => {
                                                        if (this.state.userShowData.review || this.state.userShowData.date_watched) {
                                                            this.setState({reviewModalOpen: true})
                                                        } else {
                                                            this.updateMovieUserData("viewed", !this.state.userShowData["viewed"])
                                                        }
                                                    }}>
                                                    {this.props.store.viewedOrReviewed(this.state.userShowData) ?
                                                        <i className="fas fa-eye icon-blue"/> :
                                                        <i className="far fa-eye"/>}
                                                    <span
                                                        className="action-icon-text">{this.props.store.viewedOrReviewed(this.state.userShowData) ? this.state.userShowData.review ? "Reviewed" : "Viewed" : "View"}</span>
                                                </div>
                                                <div
                                                    className="d-flex flex-column align-items-center movie-actions-icon"
                                                    onClick={() => this.updateMovieUserData("liked", !this.state.userShowData["liked"])}>
                                                    {this.state.userShowData.liked ?
                                                        <i className="fas fa-laugh-beam icon-yellow"/> :
                                                        <i className="far fa-laugh-beam"/>}
                                                    <span
                                                        className="action-icon-text">{this.state.userShowData.liked ? "Liked" : "Like"}</span>
                                                </div>
                                                <div
                                                    className="d-flex flex-column align-items-center movie-actions-icon"
                                                    onClick={() => this.updateMovieUserData("saved", !this.state.userShowData["saved"])}>
                                                    {this.state.userShowData.saved ?
                                                        <i className="fas fa-save icon-green"/> :
                                                        <i className="far fa-save"/>}
                                                    <span
                                                        className="action-icon-text">{this.state.userShowData.saved ? "Saved" : "Save"}</span>
                                                </div>
                                            </div>

                                            <div
                                                className="d-flex flex-column align-items-center justify-content-center action-rating">
                                                <span className="rating-text">Your Rating</span>
                                                <RatingComponent initialRating={this.state.userShowData.rating}
                                                                 onChange={(val) => this.updateMovieUserData("rating", val)}/>
                                            </div>
                                            {this.state.userShowData.v_rating && (
                                                <div
                                                    className="d-flex flex-column align-items-center justify-content-center v-rating">
                                                    <span className="rating-text">Vernikoff Rating</span>
                                                    <span
                                                        className="v-rating-text">{this.props.store.vernikoff_ratings[this.state.userShowData.v_rating.rating]}</span>
                                                </div>
                                            )}
                                            <div className="d-flex flex-column align-items-center review"
                                                 onClick={() => this.setState({reviewModalOpen: !this.state.reviewModalOpen})}>
                                                <span>{(this.state.userShowData.date_watched || this.state.userShowData.review) ? "Edit Review..." : "Review..."}</span>
                                            </div>
                                        </div>
                                        :
                                        <div
                                            className="movie-actions-not-logged-in d-flex flex-column justify-content-center align-items-center">
                                            <span><Link to='/login'
                                                        style={{color: 'inherit'}}>Please login to review...</Link></span>
                                        </div>
                                    }
                                    {parseInt(this.state.userShowData.total_ratings) > 0 ? (
                                            <div className="ratings-chart">
                                                <div
                                                    className="ratings-label d-flex flex-row justify-content-between align-items-end">
                                                    <span className="ratings-rating-text">Ratings</span>
                                                    <span
                                                        className="ratings-rating-total">Total: {this.state.userShowData.total_ratings}</span>
                                                </div>
                                                <div className="average-rating">
                                                    {Number.parseFloat(this.state.userShowData.average_rating).toFixed(1)}
                                                </div>
                                                <BarChart width={250} height={100}
                                                          data={this.state.userShowData.rating_groups}>
                                                    <YAxis hide={true} axisLine={false} type="number"
                                                           domain={[0, this.state.userShowData.max_one_rating]}/>
                                                    <Bar dataKey="count" fill="#8884d8"/>
                                                </BarChart>
                                            </div>
                                        )
                                        :
                                        (
                                            <span className="no-ratings-yet">No Ratings...</span>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        else
            return (
                <div/>
            )
    }
}

export default withRouter(inject("store")(observer(ShowPage)));
