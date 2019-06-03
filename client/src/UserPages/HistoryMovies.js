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
        loadingData: false,
    };

    async componentDidMount() {
        this.updatePage();
    }

    updatePage = async () => {
        this.setState({loadingData: true});
        const {username} = this.props.match.params;
        const movie_data = await this.props.store.getHistoryMoviesForUser(username, this.state.page - 1);
        const movies = await this.props.store.getMultipleMovies(movie_data.results, true);
        this.setState({movies: movies, totalPages: Math.ceil(movie_data.total / 10), loadingData: false});
    };
    changePage = (page) => {
        this.setState({page: page}, () => {
            this.updatePage()
        });
    };
    getMonth = (date) => {
        return new Date(date).toLocaleString("default", {month: 'short'});
    };
    getDay = (date) => {
        return new Date(date).toLocaleString("default", {day: '2-digit'});
    };
    getYear = (date) => {
        return new Date(date).toLocaleString("default", {year: 'numeric'});
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
                                <div className="calendar">
                                    <i className="fas fa-calendar"/>
                                    <div className="cal-month-day">
                                        <div className="cal-month-day-inner d-flex flex-row">
                                            <span className="cal-month">{this.getMonth(movie.date_watched)}</span>
                                            <span className="cal-day">{this.getDay(movie.date_watched)}</span>
                                        </div>
                                    </div>
                                    <span className="cal-year">{this.getYear(movie.date_watched)}</span>
                                </div>
                                <div
                                    className="watched-movie d-flex flex-column justify-content-center align-items-center">
                                    <Link to={`/movie/${movie.movie_id}`}>
                                        <img
                                            src={movie.poster_path ? this.props.store.getImageURL(movie.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                            className="img-history" alt="Movie poster"/>
                                    </Link>
                                </div>
                                <div className="movie-title smaller">{movie.title}</div>
                                <div className="movie-history-year">{movie.release_date.substring(0, 4)}</div>
                                <div className="movie-ratings-history">
                                    <RatingComponent readOnly={this.props.readOnly} initialRating={movie.rating}
                                                     onChange={(val) => this.updateMovieUserData("rating", val, movie.movie_id)}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Pagination url={`/search/${this.props.match.params.term}`} page={this.state.page}
                            totalPages={this.state.totalPages} link={false} callback={this.changePage}/>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(HistoryMovies)));
