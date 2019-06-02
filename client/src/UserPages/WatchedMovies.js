import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Rating from "react-rating";
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

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        return (
            <div className="d-flex flex-column align-items-center">
                <div className="watched-movies-page d-flex flex-row flex-wrap align-content-stretch">
                    {this.state.movies.map(movie => {
                        return (
                            <div key={movie.movie_id}
                                 className="watched-movie d-flex flex-column justify-content-center align-items-center">
                                <img
                                    src={movie.poster_path ? this.props.store.getImageURL(movie.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                    className="img-watched" alt="Movie poster"/>
                                <div className="movie-ratings-watched">
                                    <Rating
                                        className=""
                                        emptySymbol="far fa-star empty-star"
                                        fullSymbol="fas fa-star"
                                        stop={10}
                                        step={2}
                                        fractions={4}
                                        initialRating={movie.rating}
                                        readonly={true}
                                    />
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
