import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Loader from '../Misc/Loader';
import RatingComponent from '../Misc/Rating';
import ReviewModal from './ReviewModal';
import ImageWithLoading from '../Misc/ImageWithLoading';
import PersonCast from '../Misc/PersonCast';
import SeasonsScroller from '../Misc/SeasonsScroller';
import Scroller from '../Misc/Scroller';
import {toast} from 'react-toastify';
import {
    BarChart, Bar, YAxis
} from 'recharts';


class ShowMoviePage extends Component {
    state = {
        popularMovies: [],
        popularShows: [],
        loadingData: true,
        entityType: "null",
    };


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentDidMount() {
        this.updateData();
    }

    updateData = async () => {
        this.setState({loadingData: true});
        this.props.store.getPopularShowInfo().then(result => {
            this.setState({popularShows: result.results});
        });
        const popularMovies = await this.props.store.getPopularMovieInfo();
        this.setState({popularMovies: popularMovies.results});
        this.setState({loadingData: false});
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        return (
            <div className="movie-page-full">
                <div
                    style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.popularMovies[0].backdrop_path || this.state.popularMovies[0].poster_path)})`}}
                    className="movie-backdrop-home-page"/>
                <div
                    className="movie-content-home d-flex flex-column justify-content-center align-items-center">
                    {!this.props.store.userLoggedIn && (
                        <div className="d-flex flex-column track-signup">
                            <span className="track-your">Rate, Review, and Track your movie history!</span>
                            <Link className="btn btn-success btn-lg btn-signup-large" to={"/signup"}>Signup to
                                start!</Link>
                        </div>
                    )}
                    <span className="mr-auto border-bottom slider-header">Popular Movies</span>
                    <Scroller content={this.state.popularMovies} getImageURL={this.props.store.getImageURL}
                              size={this.props.store.poster_sizes[3]} width={150} scrollAmt={300}
                              imageCSS="poster-home-page" scrollerWidth={800} type="movie"/>
                    <br/>
                    <span className="mr-auto border-bottom slider-header">Popular Shows</span>
                    <Scroller content={this.state.popularShows} getImageURL={this.props.store.getImageURL}
                              size={this.props.store.poster_sizes[3]} width={150} scrollAmt={300}
                              imageCSS="poster-home-page" scrollerWidth={800} type="tv"/>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(ShowMoviePage)));
