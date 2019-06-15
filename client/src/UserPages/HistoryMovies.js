import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import RatingComponent from '../Misc/Rating';
import Pagination from "../Misc/Pagination";
import Loader from "../Misc/Loader";
import ImageWithLoading from '../Misc/ImageWithLoading';
import NoContent from '../Misc/NoContent';

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
        else if (this.props.sortType !== prevProps.sortType || (this.props.sortType === prevProps.sortType && this.props.sortDirection !== prevProps.sortDirection) || this.props.typeSort !== prevProps.typeSort) {
            if (this.props.typeSort !== prevProps.typeSort)
                this.updatePage(true);
            else
                this.updatePage()
        }
    }

    updatePage = async (typeSort = false) => {
        this.setState({loadingData: true});
        const {username} = this.props.match.params;
        document.title = `${username}'s History`;
        let page;
        if (typeSort) {
            this.props.history.push(this.props.location.pathname.slice(0, -1) + '1');
            page = 1
        } else {
            page = parseInt(this.props.match.params.page) || 1;
        }
        const movie_data = await this.props.store.getHistoryMoviesForUser(username, page - 1, this.props.sortType, this.props.sortDirection, this.props.typeSort);
        const movies = await this.props.store.getMultipleMovies(movie_data.results, true);
        this.setState({movies: movies, totalPages: Math.ceil(movie_data.total / 20), loadingData: false, page});
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
    updateMovieUserData = (type, val, movie_id, entityType) => {
        this.props.store.updateMovieUserData(movie_id, type, val, entityType);
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
                {this.state.movies.length === 0 && (
                    <NoContent/>
                )}
                <div
                    className="d-flex flex-column justify-content-start align-items-start align-self-start history-col">
                    {this.state.movies.map((movie, i) => {
                        return (
                            <div key={`${movie.movie_id} ${movie.type} ${movie.season}`}
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
                                    <ImageWithLoading type={movie.type} width={100}
                                                      imgStyle="img-history poster-usual"
                                                      season_number={movie.season}
                                                      makeLink={true} movie_id={movie.movie_id}
                                                      src={this.props.store.getImageURL(movie.poster_path, this.props.store.poster_sizes[3])}/>
                                </div>
                                {this.props.smallWindow && (
                                    <div className="d-flex flex-column">
                                        <div className="movie-title smaller">
                                            <Link style={{color: 'inherit'}}
                                                  to={(movie.type === "movie" && `/movie/${movie.movie_id}`) || (movie.type === "tv" && `/show/${movie.movie_id}`) || (movie.type === "season" && `/show/${movie.movie_id}/${movie.season}`)}>{movie.type === "movie" ? movie.title : movie.name}</Link>
                                        </div>
                                        {movie.type === "movie" && (
                                            <div
                                                className="movie-history-year">{movie.release_date.substring(0, 4)}</div>
                                        )}
                                        {movie.type === "tv" && (
                                            <div
                                                className="movie-history-year">{movie.first_air_date.substring(0, 4)}</div>
                                        )}
                                        {movie.type === "season" && (
                                            <div
                                                className="movie-history-year">{movie.air_date.substring(0, 4)}</div>
                                        )}
                                        <div className="movie-ratings-history">
                                            <RatingComponent readOnly={true} initialRating={movie.rating}
                                                             onChange={(val) => this.updateMovieUserData("rating", val, movie.movie_id, movie.type)}/>
                                        </div>
                                    </div>
                                )}
                                {!this.props.smallWindow && (
                                    <>
                                        <div className="movie-title smaller">
                                            <Link style={{color: 'inherit'}}
                                                  to={(movie.type === "movie" && `/movie/${movie.movie_id}`) || (movie.type === "tv" && `/show/${movie.movie_id}`) || (movie.type === "season" && `/show/${movie.movie_id}/${movie.season}`)}>{movie.type === "movie" ? movie.title : movie.name}</Link>
                                        </div>
                                        {movie.type === "movie" && (
                                            <div
                                                className="movie-history-year">{movie.release_date.substring(0, 4)}</div>
                                        )}
                                        {movie.type === "tv" && (
                                            <div
                                                className="movie-history-year">{movie.first_air_date.substring(0, 4)}</div>
                                        )}
                                        {movie.type === "season" && (
                                            <div
                                                className="movie-history-year">{movie.air_date.substring(0, 4)}</div>
                                        )}
                                        <div className="movie-ratings-history">
                                            <RatingComponent readOnly={true} initialRating={movie.rating}
                                                             onChange={(val) => this.updateMovieUserData("rating", val, movie.movie_id, movie.type)}/>
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
                <Pagination url={`/user/history/${this.props.match.params.username}`} page={this.state.page}
                            totalPages={this.state.totalPages}/>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(HistoryMovies)));
