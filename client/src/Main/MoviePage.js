import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

class MoviePage extends Component {
    state = {
        imageData: {}
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.movie_id !== this.props.match.params.movie_id) {
            console.log("updating");
            const {movie_id} = this.props.match.params;
            document.title = movie_id;
            const data = await this.props.store.getMovieInfo(movie_id);
            const OMDB_data = await this.props.store.getMovieInfoOMDB(data.imdb_id);
            if (OMDB_data.Response === "False") {
                data.ratings = [];
            } else {
                data.ratings = this.props.store.getRatings(OMDB_data);
            }
            this.setState({imageData: data});
            document.title = data.title;
            console.log(data);
        }
    }

    async componentDidMount() {
        console.log("here");
        const {movie_id} = this.props.match.params;
        document.title = movie_id;
        const data = await this.props.store.getMovieInfo(movie_id);
        const OMDB_data = await this.props.store.getMovieInfoOMDB(data.imdb_id);
        if (OMDB_data.Response === "False") {
            data.ratings = [];
        } else {
            data.ratings = this.props.store.getRatings(OMDB_data);
        }
        this.setState({imageData: data});
        document.title = data.title;
        console.log(data);
    }


    render() {
        if (Object.entries(this.state.imageData).length > 0)
            return (
                <div>
                    <div
                        style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.imageData.backdrop_path)})`}}
                        className="movie-backdrop"/>
                    <div className="mr-1 ml-1 movie-content d-flex flex-row justify-content-center">
                        <div className="movie-poster d-flex flex-column mr-2">
                            <img width={250}
                                 src={this.state.imageData.poster_path ? this.props.store.getImageURL(this.state.imageData.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                 className="img-thumbnail" alt="Movie poster"/>
                            <div className="d-flex flex-row justify-content-between ratings mt-2">
                                <div className="d-flex flex-row mr-1">
                                    <img className="mr-1" height={25}
                                         src="//i.imgur.com/2Sle5QI.png"/>
                                    <span>{this.state.imageData.ratings.imdb || "N/A"}</span>
                                </div>
                                <div className="d-flex flex-row">
                                    {this.state.imageData.ratings.rt ?
                                        parseInt(this.state.imageData.ratings.rt.slice(0, -1)) < 60 ?
                                            <img className="mr-1" height={25}
                                                 src="//i.imgur.com/6oR2eKa.png"/>
                                            :
                                            <img className="mr-1" height={25}
                                                 src="//i.imgur.com/FugNdUf.png"/>
                                        : <img className="mr-1" height={25}
                                               src="//i.imgur.com/FugNdUf.png"/>
                                    }
                                    <span>{this.state.imageData.ratings.rt || "N/A"}</span>
                                </div>
                            </div>
                        </div>
                        {/*<div className="movie-poster"*/}
                        {/*style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.imageData.poster_path)})`}}/>*/}
                        <div className="movie-info d-flex flex-column">
                            <div className="d-flex flex-row align-items-center">
                                <div className="movie-title">{this.state.imageData.title}</div>
                                <div className="movie-director-year">
                                    Directed
                                    by {this.props.store.getDirectors(this.state.imageData.credits).map((director, i, arr) => {
                                    return (<span key={director.id}>{director.name}{arr.length - 1 !== i && (
                                        <span>, </span>)}</span>)
                                })} | <span>{this.state.imageData.release_date.substring(0, 4)}</span>
                                </div>
                            </div>
                            <div className="d-flex flex-column align-items-start">
                                <div className="tag-line">{this.state.imageData.tagline}</div>
                                <div className="move-description-detail">{this.state.imageData.overview}</div>
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
