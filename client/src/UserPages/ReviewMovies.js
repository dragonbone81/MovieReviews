import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import RatingComponent from '../Misc/Rating';
import Pagination from "../Misc/Pagination";
import Loader from "../Misc/Loader";

class HistoryMovies extends Component {
    state = {
        movies: [],
        page: 1,
        loadingData: true,
        totalPages: 0,
    };

    async componentDidMount() {
        this.updatePage();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.username !== prevProps.match.params.username || this.props.match.params.page !== prevProps.match.params.page) {
            this.updatePage();
        }
    }

    updatePage = async () => {
        this.setState({loadingData: true});
        const {username} = this.props.match.params;
        const page = parseInt(this.props.match.params.page) || 1;
        const movie_data = await this.props.store.getReviewMoviesForUser(username, page - 1);
        const movies = await this.props.store.getMultipleMovies(movie_data.results, true);
        this.setState({movies: movies, totalPages: Math.ceil(movie_data.total / 10), loadingData: false, page});
    };
    updateMovieUserData = (type, val, movie_id) => {
        this.props.store.updateMovieUserData(movie_id, type, val);
        this.setState({
            movies: this.state.movies.map((movie) => {
                if (movie.movie_id === movie_id) {
                    const newMovie = {...movie};
                    newMovie[type] = val;
                    return newMovie
                } else {
                    return movie
                }
            })
        });
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        return (
            <div className="d-flex flex-column justify-content-center align-items-center">
                <div
                    className="d-flex flex-column justify-content-start align-items-start align-self-start history-col">
                    {this.state.movies.map((movie, i) => {
                        return (
                            <div key={movie.movie_id}
                                 className="d-flex flex-row align-content-stretch justify-content-start align-items-center border-bottom history-row">
                                <div
                                    className="watched-movie d-flex flex-column justify-content-center align-items-center">
                                    <Link to={`/movie/${movie.movie_id}`}>
                                        <img
                                            src={movie.poster_path ? this.props.store.getImageURL(movie.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                            className="img-history" alt="Movie poster"/>
                                    </Link>
                                </div>
                                <div className="d-flex flex-column align-self-start">
                                    <div className="movie-title smaller">
                                        <Link to={`/user/review/${movie.username}/${movie.movie_id}`}
                                              style={{color: 'inherit'}}>
                                            <span>{movie.title}</span>
                                        </Link>
                                        <span
                                            className="movie-reviews-all-year">{movie.release_date.substring(0, 4)}</span>
                                    </div>

                                    <span
                                        className="movie-review-wo-date">{movie.date_watched ? `Watched on ${new Date(movie.date_watched).toLocaleDateString('default', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}` : `Reviewed on ${new Date(movie.created_at).toLocaleDateString('default', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })}`}</span>
                                    <div className="movie-ratings-review-all">
                                        <RatingComponent readOnly={this.props.readOnly} initialRating={movie.rating}
                                                         onChange={(val) => this.updateMovieUserData("rating", val, movie.movie_id)}/>
                                    </div>
                                    <p className="movie-review-preview-review">{movie.review ? `${movie.review.substring(0, 50)}...` : "No Review..."}</p>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Pagination url={`/user/reviews/${this.props.match.params.username}`} page={this.state.page}
                            totalPages={this.state.totalPages}/>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(HistoryMovies)));
