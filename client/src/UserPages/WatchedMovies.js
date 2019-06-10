import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import RatingComponent from '../Misc/Rating';
import Pagination from "../Misc/Pagination";
import Loader from "../Misc/Loader";
import ImageWithLoading from '../Misc/ImageWithLoading';
import NoContent from '../Misc/NoContent';

class WatchedMovies extends Component {
    state = {
        movies: [],
        page: 1,
        loadingData: false,
    };

    componentDidMount() {
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
        document.title = `${username}'s Watched Movies`;
        let page;
        if (typeSort && this.props.match.params.page) {
            this.props.history.push(this.props.location.pathname.slice(0, -1) + '1');
            page = 1
        } else {
            page = parseInt(this.props.match.params.page) || 1;
        }
        const movie_data = await this.props.store.getViewedMoviesForUser(username, page - 1, this.props.sortType, this.props.sortDirection, this.props.typeSort);
        const movies = await this.props.store.getMultipleMovies(movie_data.results);
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
            <div className="d-flex flex-column align-items-center">
                {this.state.movies.length === 0 && (
                    <NoContent/>
                )}
                <div
                    className="watched-movies-page d-flex flex-row flex-wrap align-content-stretch justify-content-center align-items-center">
                    {this.state.movies.map(movie => {
                        return (
                            <div key={`${movie.movie_id} ${movie.type} ${movie.season}`}
                                 className="watched-movie d-flex flex-column justify-content-center align-items-center">
                                <ImageWithLoading type={movie.type} width={200}
                                                  imgStyle="img-watched"
                                                  season_number={movie.season}
                                                  makeLink={true} movie_id={movie.movie_id}
                                                  src={this.props.store.getImageURL(movie.poster_path, this.props.store.poster_sizes[3])}/>
                                <div className="movie-ratings-watched">
                                    <RatingComponent readOnly={true} initialRating={movie.rating}
                                                     onChange={(val) => this.updateMovieUserData("rating", val, movie.movie_id)}/>
                                    {movie.liked && (<span role="img" aria-label="up" className="ml-1">👍</span>)}
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Pagination url={`/user/movies/${this.props.match.params.username}`}
                            page={this.state.page}
                            totalPages={this.state.totalPages}/>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(WatchedMovies)));
