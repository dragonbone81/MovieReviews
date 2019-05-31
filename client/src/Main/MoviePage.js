import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Loader from '../Misc/Loader';

class MoviePage extends Component {
    state = {
        movieData: {},
        userMovieData: {},
        loadingData: false,
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

    updateMovieBoolean = (type) => {
        this.props.store.updateMovieBoolean(this.state.movieData.id, type, !this.state.userMovieData[type]);
        const updatedState = {...this.state.userMovieData};
        updatedState[type] = !this.state.userMovieData[type];
        this.setState({userMovieData: updatedState})
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        if (Object.entries(this.state.movieData).length > 0)
            return (
                <div className="test">
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
                        {/*<div className="movie-poster"*/}
                        {/*style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.imageData.poster_path)})`}}/>*/}
                        <div className="movie-info d-flex flex-column">
                            <div className="d-flex flex-row align-items-center">
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
                                <div className="movie-actions d-flex flex-column">
                                    <div className="d-flex flex-row movie-actions-icons justify-content-between">
                                        <div className="d-flex flex-column align-items-center movie-actions-icon"
                                             onClick={() => this.updateMovieBoolean("viewed")}>
                                            {this.state.userMovieData.viewed ?
                                                <i className="fas fa-eye icon-blue"/> :
                                                <i className="far fa-eye"/>}
                                            <span
                                                className="action-icon-text">{this.state.userMovieData.viewed ? "Viewed" : "View"}</span>
                                        </div>
                                        <div className="d-flex flex-column align-items-center movie-actions-icon"
                                             onClick={() => this.updateMovieBoolean("liked")}>
                                            {this.state.userMovieData.liked ?
                                                <i className="fas fa-laugh-beam icon-yellow"/> :
                                                <i className="far fa-laugh-beam"/>}
                                            <span
                                                className="action-icon-text">{this.state.userMovieData.liked ? "Liked" : "Like"}</span>
                                        </div>
                                        <div className="d-flex flex-column align-items-center movie-actions-icon"
                                             onClick={() => this.updateMovieBoolean("saved")}>
                                            {this.state.userMovieData.saved ?
                                                <i className="fas fa-save icon-green"/> :
                                                <i className="far fa-save"/>}
                                            <span
                                                className="action-icon-text">{this.state.userMovieData.saved ? "Saved" : "Save"}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        else
            return (<div/>)
    }
}

export default withRouter(inject("store")(observer(MoviePage)));
