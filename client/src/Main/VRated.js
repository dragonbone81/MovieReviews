import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Pagination from "../Misc/Pagination";
import Loader from "../Misc/Loader";
import ImageWithLoading from '../Misc/ImageWithLoading';
import NoContent from '../Misc/NoContent';
import SortingComponent from "../Misc/SortingComponent";

class SavedMovies extends Component {
    initStateSort = {updated_at: "desc", rating: "desc"};
    sortTypes = [{id: "movie", name: "Movies"}, {id: "tv", name: "Shows"}, {id: "season", name: "Seasons"}, {
        id: "all",
        name: "All"
    }];
    state = {
        movies: [],
        page: 1,
        loadingData: false,
        sort: {...this.initStateSort},
        sortType: "updated_at",
        sortDirection: "desc",
        sortShown: true,
        typeSort: 3,
    };

    componentDidMount() {
        this.updatePage();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.username !== prevProps.match.params.username || this.props.match.params.page !== prevProps.match.params.page) {
            this.updatePage();
        } else if (this.state.sortType !== prevState.sortType || (this.state.sortType === prevState.sortType && this.state.sortDirection !== prevState.sortDirection) || this.props.typeSort !== prevProps.typeSort) {
            if (this.state.typeSort !== prevState.typeSort)
                this.updatePage(true);
            else
                this.updatePage()
        }
    }

    updatePage = async (typeSort = false) => {
        this.setState({loadingData: true});
        document.title = `V-Rated Movies`;
        let page;
        if (typeSort && this.props.match.params.page) {
            this.props.history.push(this.props.location.pathname.slice(0, -1) + '1');
            page = 1
        } else {
            page = parseInt(this.props.match.params.page) || 1;
        }
        const movie_data = await this.props.store.getVratedMovies(page - 1, this.state.sortType, this.state.sortDirection, this.sortTypes[this.state.typeSort].id);
        const movies = await this.props.store.getMultipleMovies(movie_data.results);
        this.setState({movies: movies, totalPages: Math.ceil(movie_data.total / 20), loadingData: false, page});
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
            <div className="user-page">
                <div className="user-page-content">
                    {/*<div className="">*/}
                    {/*<SortingComponent typeName={this.sortTypes[this.state.typeSort].name}*/}
                    {/*changeTypeSort={this.changeTypeSort} sortType={this.state.sortType}*/}
                    {/*changeSortDirection={this.changeSortDirection}*/}
                    {/*sort={this.state.sort}*/}
                    {/*changeSortType={this.changeSortType} sortShown={this.state.sortShown}/>*/}
                    <div className="d-flex flex-column align-items-center">
                        {this.state.movies.length === 0 && (
                            <NoContent/>
                        )}
                        <div
                            className="watched-movies-page d-flex flex-row flex-wrap align-content-stretch justify-content-center align-items-center">
                            {this.state.movies.map(movie => {
                                const name = (movie.title || movie.name);
                                return (
                                    <div key={`${movie.movie_id} ${movie.type} ${movie.season}`}
                                         className="watched-movie v-rated-movie-div d-flex flex-column justify-content-center align-items-center">
                                        <ImageWithLoading type={movie.type} width={200}
                                                          imgStyle="img-watched poster-usual"
                                                          season_number={movie.season}
                                                          makeLink={true} movie_id={movie.movie_id}
                                                          src={this.props.store.getImageURL(movie.poster_path, this.props.store.poster_sizes[3])}/>
                                        <span
                                            className="v-rated-movie-v-rating">{this.props.store.vernikoff_ratings[movie.rating]}</span>
                                        <Link
                                            style={{color: 'white'}}
                                            to={(movie.type === "movie" && `/movie/${movie.movie_id}`) || (movie.type === "tv" && `/show/${movie.movie_id}`) || (movie.type === "season" && `/show/${movie.movie_id}/${movie.season}`)}
                                            className="saved-movie-title">{name.length > 15 ? `${name.slice(0, 16)}...` : name}</Link>
                                    </div>
                                )
                            })}
                        </div>
                        <Pagination url={`/vrated`}
                                    page={this.state.page}
                                    totalPages={this.state.totalPages}/>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(SavedMovies)));
