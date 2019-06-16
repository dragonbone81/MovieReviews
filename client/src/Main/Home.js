import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Loader from '../Misc/Loader';
import RatingComponent from '../Misc/Rating';
import ImageWithLoading from '../Misc/ImageWithLoading';
import Scroller from '../Misc/Scroller';


class ShowMoviePage extends Component {
    state = {
        popularMovies: [],
        popularShows: [],
        recentReviewsMovies: [],
        recentReviewsShows: [],
        loadingData: true,
        entityType: "null",
        smallWindow: window.innerWidth < 750,
    };


    componentDidUpdate(prevProps, prevState, snapshot) {

    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
        document.title = "V-Ratings";
        this.updateData();
    }

    onWindowResize = () => {
        if (window.innerWidth < 750 && !this.state.smallWindow) {
            this.setState({smallWindow: true});
        }
        if (window.innerWidth >= 750 && this.state.smallWindow) {
            this.setState({smallWindow: false});
        }
    };
    updateData = async () => {
        this.setState({loadingData: true});
        this.props.store.getPopularShowInfo().then(result => {
            this.setState({popularShows: result.results});
        });
        this.props.store.getRecentReviews("movie").then(async (reviews) => {
            const movies = await this.props.store.getMultipleMovies(reviews, true);
            this.setState({recentReviewsMovies: movies.map((movie, i) => ({...movie, ...reviews[i]}))});
        });
        this.props.store.getRecentReviews("tv").then(async (reviews) => {
            const movies = await this.props.store.getMultipleMovies(reviews, true);
            this.setState({recentReviewsShows: movies.map((movie, i) => ({...movie, ...reviews[i]}))});
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
                    style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.popularMovies.filter(m => m.original_language === "en")[0].backdrop_path || this.state.popularMovies[0].poster_path)})`}}
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
                    <span className=" border-bottom recent-reviews">Recent Movie Reviews</span>
                    <div className="d-flex flex-row flex-wrap justify-content-center">
                        {this.state.recentReviewsMovies.map(review => {
                                return (
                                    <div key={review.movie_id}
                                         className="d-flex flex-column justify-content-center align-items-center movie-ratings-history">
                                        <ImageWithLoading type={"movie"} width={100}
                                                          imgStyle={"poster-home-page"}
                                                          makeLink={true}
                                                          movie_id={review.movie_id}
                                                          review={review}
                                                          src={this.props.store.getImageURL(review.poster_path, this.props.store.poster_sizes[3])}/>
                                        <RatingComponent readOnly={true} initialRating={review.rating}/>
                                    </div>
                                )
                            }
                        )}
                    </div>
                    <br/>
                    <span className="mr-auto border-bottom slider-header">Popular Movies</span>
                    {!this.state.smallWindow && (
                        <Scroller content={this.state.popularMovies} getImageURL={this.props.store.getImageURL}
                                  size={this.props.store.poster_sizes[3]} width={150} scrollAmt={400}
                                  imageCSS="poster-home-page" scrollerWidth={800} type="movie"/>
                    )}
                    {this.state.smallWindow && (
                        <div className="d-flex flex-row flex-wrap justify-content-center">
                            {this.state.popularMovies.map(movie =>
                                <ImageWithLoading type={"movie"} width={100}
                                                  imgStyle="poster-home-page"
                                                  makeLink={true}
                                                  movie_id={movie.id}
                                                  key={movie.id}
                                                  src={this.props.store.getImageURL(movie.poster_path, this.props.store.poster_sizes[3])}/>
                            )}
                        </div>
                    )}
                    <br/>
                    <span className=" border-bottom recent-reviews">Recent Show Reviews</span>
                    <div className="d-flex flex-row flex-wrap justify-content-center">
                        {this.state.recentReviewsShows.map(review => {
                                return (
                                    <div key={`${review.movie_id} ${review.type}`}
                                         className="d-flex flex-column justify-content-center align-items-center movie-ratings-history">
                                        <ImageWithLoading type={"tv"} width={100}
                                                          imgStyle={"poster-home-page"}
                                                          makeLink={true}
                                                          movie_id={review.movie_id}
                                                          review={review}
                                                          src={this.props.store.getImageURL(review.poster_path, this.props.store.poster_sizes[3])}/>
                                        <RatingComponent readOnly={true} initialRating={review.rating}/>
                                    </div>
                                )
                            }
                        )}
                    </div>
                    <br/>
                    <span className="mr-auto border-bottom slider-header">Popular Shows</span>
                    {!this.state.smallWindow && (
                        <Scroller content={this.state.popularShows} getImageURL={this.props.store.getImageURL}
                                  size={this.props.store.poster_sizes[3]} width={150} scrollAmt={400}
                                  imageCSS="poster-home-page" scrollerWidth={800} type="tv"/>
                    )}
                    {this.state.smallWindow && (
                        <div className="d-flex flex-row flex-wrap justify-content-center">
                            {this.state.popularShows.map(show =>
                                <ImageWithLoading type={"tv"} width={100}
                                                  imgStyle="poster-home-page"
                                                  makeLink={true}
                                                  movie_id={show.id}
                                                  key={show.id}
                                                  src={this.props.store.getImageURL(show.poster_path, this.props.store.poster_sizes[3])}/>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(ShowMoviePage)));
