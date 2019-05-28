import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

class MoviePage extends Component {
    state = {
        imageData: {}
    };

    async componentDidMount() {
        const {movie_id} = this.props.match.params;
        document.title = movie_id;
        const data = await this.props.store.getMovieInfo(movie_id);
        const OMDB_data = await this.props.store.getMovieInfoOMDB(data.imdb_id);
        data.ratings = this.props.store.getRatings(OMDB_data);
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
                    <div className="mr-1 ml-1 movie-content d-flex flex-row justify-content-around">
                        <div className="movie-poster d-flex flex-column mr-2">
                            <img width={250} src={this.props.store.getImageURL(this.state.imageData.poster_path)}
                                 className="img-thumbnail" alt="Movie poster"/>
                            <div className="d-flex flex-row justify-content-between ratings mt-1">
                                <div className="d-flex flex-row mr-1">
                                    <img className="mr-1" height={25}
                                         src="//i.imgur.com/2Sle5QI.png"/>
                                    <span>{this.state.imageData.ratings.imdb}</span>
                                </div>
                                <div className="d-flex flex-row">
                                    {parseInt(this.state.imageData.ratings.rt.slice(0, -1)) < 60 ?
                                        <img className="mr-1" height={25}
                                             src="//i.imgur.com/6oR2eKa.png"/>
                                        :
                                        <img className="mr-1" height={25}
                                             src="//i.imgur.com/FugNdUf.png"/>
                                    }
                                    <span>{this.state.imageData.ratings.rt}</span>
                                </div>
                            </div>
                        </div>
                        {/*<div className="movie-poster"*/}
                        {/*style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.imageData.poster_path)})`}}/>*/}
                        <div className="movie-info d-flex flex-column">
                            <div className="movie-title">{this.state.imageData.title}</div>
                            <div className="movie-director-year">
                                Directed
                                by {this.props.store.getDirectors(this.state.imageData.credits).map((director, i, arr) => {
                                return (<span key={director.id}>{director.name}{arr.length - 1 !== i && (
                                    <span>, </span>)}</span>)
                            })} | <span>{this.state.imageData.release_date.substring(0, 4)}</span>
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
