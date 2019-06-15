import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {Link, withRouter} from 'react-router-dom';
import RatingComponent from '../Misc/Rating';
import Loader from "../Misc/Loader";
import ImageWithLoading from '../Misc/ImageWithLoading';

class WatchedMovies extends Component {
    state = {
        movieData: {},
        loadingData: true,
        movieReviewDoesNotExist: false,
    };

    async componentDidMount() {
        this.updatePage();
    }

    updatePage = async () => {
        this.setState({loadingData: true, movieReviewDoesNotExist: false});
        const {username, movie_id, entity_type, season} = this.props.match.params;
        const movieData = await this.props.store.getUsersMovieReview(movie_id, username, entity_type, season);
        if (movieData === undefined) {
            this.setState({movieReviewDoesNotExist: true});
            return;
        }
        if (movieData.type === "tv") {
            movieData.first_air_date = movieData.release_date;
            movieData.name = movieData.title;
        }
        if (movieData.type === "season") {
            movieData.air_date = movieData.release_date;
            movieData.name = movieData.title;
        }
        document.title = `${movieData.title} reviewed by ${username}`;
        this.setState({movieData: {...movieData || {}}, loadingData: false});
    };
    updateMovieUserData = (type, val, movie_id) => {
        this.props.store.updateMovieUserData(movie_id, type, val, this.state.movieData.type);
        const newMovieData = {...this.state.movieData};
        newMovieData[type] = val;
        this.setState({
            movieData: newMovieData
        });
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        if (this.state.movieReviewDoesNotExist) {
            return (
                <div>Review does not exist.</div>
            )
        }
        return (
            <div className="d-flex flex-column">
                {this.props.smallWindow && (
                    <div className="movie-img-review-page-div align-self-center">
                        <ImageWithLoading type={this.state.movieData.type} width={200}
                                          imgStyle="img-review-page poster-usual"
                                          season_number={this.props.match.params.season}
                                          makeLink={true} movie_id={this.state.movieData.movie_id}
                                          src={this.props.store.getImageURL(this.state.movieData.poster_path, this.props.store.poster_sizes[3])}/>
                    </div>
                )}
                <div className="d-flex flex-row justify-content-between">
                    {!this.props.smallWindow && (
                        <div className="movie-img-review-page-div">
                            <ImageWithLoading type={this.state.movieData.type} width={200}
                                              imgStyle="img-review-page poster-usual"
                                              season_number={this.props.match.params.season}
                                              makeLink={true} movie_id={this.state.movieData.movie_id}
                                              src={this.props.store.getImageURL(this.state.movieData.poster_path, this.props.store.poster_sizes[3])}/>
                        </div>
                    )}
                    <div className="d-flex flex-column flex-fill">
                        <span
                            className="review-by-text-page border-bottom">Reviewed by: <Link
                            style={{textDecoration: 'none', color: '#cbe2f4'}}
                            to={`/user/${this.props.match.params.username}`}>{this.props.match.params.username}</Link></span>
                        <div className="d-flex flex-row movie-review-user-title-year">
                            <span
                                className="movie-review-user-title">{this.state.movieData.type === "movie" ? this.state.movieData.title : this.state.movieData.name}</span>
                            {this.state.movieData.type === "movie" && (
                                <span
                                    className="movie-review-user-year">{this.state.movieData.release_date.substring(0, 4)}</span>
                            )}
                            {this.state.movieData.type === "tv" && (
                                <span
                                    className="movie-review-user-year">{this.state.movieData.first_air_date.substring(0, 4)}</span>
                            )}
                            {this.state.movieData.type === "season" && (
                                <span
                                    className="movie-review-user-year">{this.state.movieData.air_date.substring(0, 4)}</span>
                            )}
                            <div className="user-review-ratings">
                                <RatingComponent readOnly={true}
                                                 initialRating={this.state.movieData.rating}
                                                 onChange={(val) => this.updateMovieUserData("rating", val, this.state.movieData.movie_id)}/>
                                {this.state.movieData.liked && (
                                    <span role="img" aria-label="up" className="ml-1">👍</span>)}
                            </div>
                        </div>
                        <span
                            className="movie-review-wo-date">{this.state.movieData.date_watched ? `Watched on ${new Date(this.state.movieData.date_watched).toLocaleDateString('default', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}` : `Reviewed on ${new Date(this.state.movieData.created_at).toLocaleDateString('default', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}`}</span>
                        <div className="movie-review-actual-review">
                            {this.state.movieData.review ? this.state.movieData.review.split("\n").filter(e => e !== "").map((par, i) => {
                                return <p key={i}>{par}</p>
                            }) : <p>No review...</p>}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(WatchedMovies)));
