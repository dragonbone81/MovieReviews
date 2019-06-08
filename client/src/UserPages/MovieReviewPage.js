import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {Link, withRouter} from 'react-router-dom';
import RatingComponent from '../Misc/Rating';
import Pagination from "../Misc/Pagination";
import Loader from "../Misc/Loader";
import ImageWithLoading from '../Misc/ImageWithLoading';

class WatchedMovies extends Component {
    state = {
        movieData: {},
        loadingData: true,
        movieReviewDoesNotExist: false,
    };

    async componentDidMount() {
        this.updatePage();
    }

    updatePage = async () => {
        this.setState({loadingData: true, movieReviewDoesNotExist: false});
        const {username, movie_id} = this.props.match.params;
        const promiseData = await Promise.all([this.props.store.getUsersMovieReview(movie_id, username), this.props.store.getMovieInfo(movie_id)])
        if (promiseData[0] === undefined) {
            this.setState({movieReviewDoesNotExist: true});
            return;
        }
        document.title = `${promiseData[1].title} reviewed by ${username}`;
        this.setState({showData: {...promiseData[0] || {}, ...promiseData[1] || {}}, loadingData: false});
    };
    // changePage = (page) => {
    //     this.setState({page: page}, () => {
    //         this.updatePage()
    //     });
    // };
    updateMovieUserData = (type, val, movie_id) => {
        this.props.store.updateMovieUserData(movie_id, type, val);
        const newMovieData = {...this.state.movieData};
        newMovieData[type] = val;
        this.setState({
            showData: newMovieData
        });
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        if (this.state.movieReviewDoesNotExist) {
            return (
                <div>Review does not exist.</div>
            )
        }
        return (
            <div className="d-flex flex-column">
                <div className="d-flex flex-row justify-content-between">
                    <div className="movie-img-review-page-div">
                        <ImageWithLoading type={this.state.movieData.type} width={200}
                                          imgStyle="img-review-page"
                                          makeLink={true} movie_id={this.state.movieData.movie_id}
                                          src={this.props.store.getImageURL(this.state.movieData.poster_path, this.props.store.poster_sizes[3])}/>
                    </div>
                    <div className="d-flex flex-column flex-fill">
                        <span
                            className="review-by-text-page border-bottom">Reviewed by: <Link
                            style={{textDecoration: 'none', color: '#cbe2f4'}}
                            to={`/user/${this.props.match.params.username}`}>{this.props.match.params.username}</Link></span>
                        <div className="d-flex flex-row movie-review-user-title-year">
                            <span className="movie-review-user-title">{this.state.movieData.title}</span>
                            <span
                                className="movie-review-user-year">{this.state.movieData.release_date.substring(0, 4)}</span>
                            <div className="user-review-ratings">
                                <RatingComponent readOnly={this.props.readOnly}
                                                 initialRating={this.state.movieData.rating}
                                                 onChange={(val) => this.updateMovieUserData("rating", val, this.state.movieData.movie_id)}/>
                            </div>
                        </div>
                        <span
                            className="movie-review-wo-date">{this.state.movieData.date_watched ? `Watched on ${new Date(this.state.movieData.date_watched).toLocaleDateString('default', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}` : `Reviewed on ${new Date(this.state.movieData.created_at).toLocaleDateString('default', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                        })}`}</span>
                        <div className="movie-review-actual-review">
                            {this.state.movieData.review ? this.state.movieData.review.split("\n").filter(e => e !== "").map((par, i) => {
                                return <p key={i}>{par}</p>
                            }) : <p>No review...</p>}
                        </div>
                    </div>
                </div>
                {/*<div*/}
                {/*className="watched-movies-page d-flex flex-row flex-wrap align-content-stretch justify-content-center align-items-center">*/}
                {/*{this.state.movies.map(movie => {*/}
                {/*return (*/}
                {/*<div key={movie.movie_id}*/}
                {/*className="watched-movie d-flex flex-column justify-content-center align-items-center">*/}
                {/*<Link to={`/movie/${movie.movie_id}`}>*/}
                {/*<img*/}
                {/*src={movie.poster_path ? this.props.store.getImageURL(movie.poster_path) : "https://i.imgur.com/IiA2iLz.png"}*/}
                {/*className="img-watched" alt="Movie poster"/>*/}
                {/*</Link>*/}
                {/*<div className="movie-ratings-watched">*/}
                {/*<RatingComponent readOnly={this.props.readOnly} initialRating={movie.rating}*/}
                {/*onChange={(val) => this.updateMovieUserData("rating", val, movie.movie_id)}/>*/}
                {/*</div>*/}
                {/*</div>*/}
                {/*)*/}
                {/*})}*/}
                {/*</div>*/}
                {/*<Pagination url={`/search/${this.props.match.params.term}`} page={this.state.page}*/}
                {/*totalPages={this.state.totalPages} link={false} callback={this.changePage}/>*/}
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(WatchedMovies)));
