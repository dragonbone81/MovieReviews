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
        this.setState({imageData: data});
        document.title = data.title;
        console.log(data);
        console.log(this.props.store.getDirectors(data.credits))
    }


    render() {
        if (Object.entries(this.state.imageData).length > 0)
            return (
                <div>
                    <div
                        style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.imageData.backdrop_path)})`}}
                        className="movie-backdrop"/>
                    <div className="movie-content d-flex flex-row justify-content-around">
                        <div className="movie-poster">
                            <img width={250} src={this.props.store.getImageURL(this.state.imageData.poster_path)}
                                 className="img-thumbnail" alt="Movie poster"/>
                        </div>
                        {/*<div className="movie-poster"*/}
                        {/*style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.imageData.poster_path)})`}}/>*/}
                        <div className="movie-info d-flex flex-column">
                            <div className="movie-title">{this.state.imageData.title}</div>
                            <div className="movie-director-year">
                                Directed
                                by {this.props.store.getDirectors(this.state.imageData.credits).map(director => {
                                return <span key={director.id}>{director.name}</span>
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
