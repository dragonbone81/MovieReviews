import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

class MoviePage extends Component {
    state = {
        movieData: {},
        userData: {},
    };

    updateWithNewMovie = async () => {
        const {movie_id} = this.props.match.params;
        document.title = movie_id;
        this.props.store.getMovieInfo(movie_id).then(async (data) => {
            this.props.store.getUsersMovieDetail(movie_id).then(userData => {
                this.setState({userData});
            });
            const OMDB_data = await this.props.store.getMovieInfoOMDB(data.imdb_id);
            if (OMDB_data.Response === "False") {
                data.ratings = [];
            } else {
                data.ratings = this.props.store.getRatings(OMDB_data);
            }
            this.setState({movieData: data});
            document.title = data.title;
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.movie_id !== this.props.match.params.movie_id) {
            this.updateWithNewMovie();
        }
    }

    async componentDidMount() {
        this.updateWithNewMovie();
        // console.log(movie)
    }

    updateMovieBoolean = (type) => {
        this.props.store.updateMovieBoolean(this.state.movieData.id, type, !this.state.userData[type]);
        const updatedState = {...this.state.userData};
        updatedState[type] = !this.state.userData[type];
        this.setState({userData: updatedState})
    };

    render() {
        if (Object.entries(this.state.movieData).length > 0)
            return (
                <div>
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
                                        {/*<i className="fas fa-eye"/>*/}
                                        <div className="d-flex flex-column align-items-center"
                                             onClick={() => this.updateMovieBoolean("viewed")}>
                                            <i className="far fa-eye"/>
                                            <span
                                                className="action-icon-text">{this.state.userData.viewed ? "Viewed" : "View"}</span>
                                        </div>
                                        <div className="d-flex flex-column align-items-center"
                                             onClick={() => this.updateMovieBoolean("liked")}>
                                            <i className="far fa-laugh-beam"/>
                                            <span
                                                className="action-icon-text">{this.state.userData.liked ? "Liked" : "Like"}</span>
                                        </div>
                                        {/*<i className="fas fa-laugh-beam"/>*/}
                                        {/*<i className="fas fa-save"/>*/}
                                        <div className="d-flex flex-column align-items-center"
                                             onClick={() => this.updateMovieBoolean("saved")}>
                                            <i className="far fa-save"/>
                                            <span
                                                className="action-icon-text">{this.state.userData.saved ? "Saved" : "Save"}</span>
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
