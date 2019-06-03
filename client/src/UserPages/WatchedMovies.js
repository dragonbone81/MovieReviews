import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {Link, withRouter} from 'react-router-dom';
import RatingComponent from '../Misc/Rating';
import Pagination from "../Misc/Pagination";
import Loader from "../Misc/Loader";

class WatchedMovies extends Component {
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
        const movie_data = await this.props.store.getViewedMoviesForUser(username, this.state.page - 1);
        const movies = await this.props.store.getMultipleMovies(movie_data.results);
        this.setState({movies: movies, totalPages: Math.ceil(movie_data.total / 10), loadingData: false});
    };
    changePage = (page) => {
        this.setState({page: page}, () => {
            this.updatePage()
        });
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
                <div
                    className="watched-movies-page d-flex flex-row flex-wrap align-content-stretch justify-content-center align-items-center">
                    {this.state.movies.map(movie => {
                        return (
                            <div key={movie.movie_id}
                                 className="watched-movie d-flex flex-column justify-content-center align-items-center">
                                <Link to={`/movie/${movie.movie_id}`}>
                                    <img
                                        src={movie.poster_path ? this.props.store.getImageURL(movie.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                        className="img-watched" alt="Movie poster"/>
                                </Link>
                                <div className="movie-ratings-watched">
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

export default withRouter(inject("store")(observer(WatchedMovies)));
