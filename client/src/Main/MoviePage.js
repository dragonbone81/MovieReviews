import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Loader from '../Misc/Loader';
import ReviewModal from './ReviewModal';
import Rating from 'react-rating'
import {
    BarChart, Bar, YAxis
} from 'recharts';


class MoviePage extends Component {
    state = {
        movieData: {},
        userMovieData: {},
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
    updateWithNewMovie = async () => {
        this.setState({loadingData: true});
        const {movie_id} = this.props.match.params;
        document.title = movie_id;
        let movieData = this.props.store.getMovieInfo(movie_id);
        let userMovieData = this.props.store.getUsersMovieDetail(movie_id);
        const result = await Promise.all([movieData, userMovieData]);
        movieData = result[0];
        userMovieData = result[1];
        userMovieData.rating_groups = this.normalizeRatings(userMovieData.rating_groups);
        userMovieData.max_one_rating = Math.max.apply(Math, userMovieData.rating_groups.map(e => e.count));
        console.log(userMovieData.rating_groups)
        document.title = movieData.title;
        const OMDB_data = await this.props.store.getMovieInfoOMDB(movieData.imdb_id);
        if (OMDB_data.Response === "False") {
            movieData.ratings = [];
        } else {
            movieData.ratings = this.props.store.getRatings(OMDB_data);
        }
        this.setState({movieData: movieData || {}, userMovieData: userMovieData || {}}, () => {
            this.setState({loadingData: false});
        });
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.movie_id !== this.props.match.params.movie_id) {
            this.updateWithNewMovie();
        }
    }

    async componentDidMount() {
        this.updateWithNewMovie();
    }

    updateMovieUserData = (type, val) => {
        this.props.store.updateMovieUserData(this.state.movieData.id, type, val);
        const updatedState = {...this.state.userMovieData};
        updatedState[type] = val;
        this.setState({userMovieData: updatedState})
    };
    updateReviewDate = (review, date_watched) => {
        this.setState({userMovieData: {...this.state.userMovieData, review, date_watched}})
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        if (Object.entries(this.state.movieData).length > 0)
            return (
                <div className="movie-page-full">
                    <ReviewModal updateReviewDate={this.updateReviewDate} userMovieData={this.state.userMovieData}
                                 movie={this.state.movieData}
                                 open={this.state.reviewModalOpen}
                                 close={() => this.setState({reviewModalOpen: false})}/>
                    <div
                        style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.movieData.backdrop_path)})`}}
                        className="movie-backdrop"/>
                    <div className="mr-1 ml-1 movie-content d-flex flex-row justify-content-center">
                        <div className="movie-poster d-flex flex-column mr-2">
                            <img width={250}
                                 src={this.state.movieData.poster_path ? this.props.store.getImageURL(this.state.movieData.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                 className="img-thumbnail" alt="Movie poster"/>
                            <div className="d-flex flex-row justify-content-between ratings mt-2">
                                <div className="d-flex flex-row mr-1">
                                    <img className="mr-1" height={25}
                                         src="//i.imgur.com/2Sle5QI.png"/>
                                    <span>{this.state.movieData.ratings.imdb || "N/A"}</span>
                                </div>
                                <div className="d-flex flex-row">
                                    {this.state.movieData.ratings.rt ?
                                        parseInt(this.state.movieData.ratings.rt.slice(0, -1)) < 60 ?
                                            <img className="mr-1" height={25}
                                                 src="//i.imgur.com/6oR2eKa.png"/>
                                            :
                                            <img className="mr-1" height={25}
                                                 src="//i.imgur.com/FugNdUf.png"/>
                                        : <img className="mr-1" height={25}
                                               src="//i.imgur.com/FugNdUf.png"/>
                                    }
                                    <span>{this.state.movieData.ratings.rt || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                        <div className="movie-info d-flex flex-column">
                            <div className="d-flex flex-row align-items-center movie-title-d-y">
                                <div className="movie-title">{this.state.movieData.title}</div>
                                <div className="movie-director-year">
                                    Directed
                                    by {this.props.store.getDirectors(this.state.movieData.credits).map((director, i, arr) => {
                                    return (<span key={director.id}>{director.name}{arr.length - 1 !== i && (
                                        <span>, </span>)}</span>)
                                })} | <span>{this.state.movieData.release_date.substring(0, 4)}</span>
                                </div>
                            </div>
                            <div className="d-flex flex-row">
                                <div className="d-flex flex-column align-items-start">
                                    <div className="tag-line">{this.state.movieData.tagline}</div>
                                    <div className="move-description-detail">{this.state.movieData.overview}</div>
                                </div>
                                <div className="d-flex flex-column">
                                    <div className="movie-actions d-flex flex-column">
                                        <div className="d-flex flex-row movie-actions-icons justify-content-between">
                                            <div className="d-flex flex-column align-items-center movie-actions-icon"
                                                 onClick={() => {
                                                     if (this.state.userMovieData.review || this.state.userMovieData.date_watched) {
                                                         this.setState({reviewModalOpen: true})
                                                     } else {
                                                         this.updateMovieUserData("viewed", !this.state.userMovieData["viewed"])
                                                     }
                                                 }}>
                                                {this.props.store.viewedOrReviewed(this.state.userMovieData) ?
                                                    <i className="fas fa-eye icon-blue"/> :
                                                    <i className="far fa-eye"/>}
                                                <span
                                                    className="action-icon-text">{this.props.store.viewedOrReviewed(this.state.userMovieData) ? this.state.userMovieData.review ? "Reviewed" : "Viewed" : "View"}</span>
                                            </div>
                                            <div className="d-flex flex-column align-items-center movie-actions-icon"
                                                 onClick={() => this.updateMovieUserData("liked", !this.state.userMovieData["liked"])}>
                                                {this.state.userMovieData.liked ?
                                                    <i className="fas fa-laugh-beam icon-yellow"/> :
                                                    <i className="far fa-laugh-beam"/>}
                                                <span
                                                    className="action-icon-text">{this.state.userMovieData.liked ? "Liked" : "Like"}</span>
                                            </div>
                                            <div className="d-flex flex-column align-items-center movie-actions-icon"
                                                 onClick={() => this.updateMovieUserData("saved", !this.state.userMovieData["saved"])}>
                                                {this.state.userMovieData.saved ?
                                                    <i className="fas fa-save icon-green"/> :
                                                    <i className="far fa-save"/>}
                                                <span
                                                    className="action-icon-text">{this.state.userMovieData.saved ? "Saved" : "Save"}</span>
                                            </div>
                                        </div>
                                        <div
                                            className="d-flex flex-column align-items-center justify-content-center action-rating">
                                            <span className="rating-text">Your Rating</span>
                                            <Rating
                                                className=""
                                                emptySymbol="far fa-star empty-star"
                                                fullSymbol="fas fa-star"
                                                stop={10}
                                                step={2}
                                                fractions={2}
                                                initialRating={this.state.userMovieData.rating}
                                                onChange={(val) => this.updateMovieUserData("rating", val)}
                                            />
                                        </div>
                                        <div className="d-flex flex-column align-items-center review"
                                             onClick={() => this.setState({reviewModalOpen: !this.state.reviewModalOpen})}>
                                            <span>{(this.state.userMovieData.date_watched || this.state.userMovieData.review) ? "Edit Review..." : "Review..."}</span>
                                        </div>
                                    </div>
                                    {parseInt(this.state.userMovieData.total_ratings) > 0 ? (
                                            <div className="ratings-chart">
                                                <div
                                                    className="ratings-label d-flex flex-row justify-content-between align-items-end">
                                                    <span className="ratings-rating-text">Ratings</span>
                                                    <span
                                                        className="ratings-rating-total">Total: {this.state.userMovieData.total_ratings}</span>
                                                </div>
                                                <div className="average-rating">
                                                    {Number.parseFloat(this.state.userMovieData.average_rating).toFixed(1)}
                                                </div>
                                                <BarChart width={250} height={100}
                                                          data={this.state.userMovieData.rating_groups}>
                                                    <YAxis hide={true} axisLine={false} type="number"
                                                           domain={[0, this.state.userMovieData.max_one_rating]}/>
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

export default withRouter(inject("store")(observer(MoviePage)));
