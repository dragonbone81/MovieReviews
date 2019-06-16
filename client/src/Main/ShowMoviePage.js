import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Loader from '../Misc/Loader';
import RatingComponent from '../Misc/Rating';
import ReviewModal from './ReviewModal';
import ImageWithLoading from '../Misc/ImageWithLoading';
import PersonCast from '../Misc/PersonCast';
import SeasonsScroller from '../Misc/SeasonsScroller';
import {toast} from 'react-toastify';
import {
    BarChart, Bar, YAxis
} from 'recharts';


class ShowMoviePage extends Component {
    state = {
        data: {},
        userData: {},
        loadingData: false,
        reviewModalOpen: false,
        entityType: "null",
        smallWindow: window.innerWidth < 830,
        kindaSmallWindow: window.innerWidth < 1111,
    };
    normalizeRatings = (ratings) => {
        const ratingGroups = ratings.map(rating => ({rating: parseInt(rating.rating), count: parseInt(rating.count)}));
        const min = Math.min.apply(Math, ratingGroups.map(e => e.count));
        for (let i = 1; i < 10; i++) {
            if (!ratingGroups.some(e => e.rating === i)) {
                ratingGroups.push({rating: i, count: min / 100})
            }
        }
        ratingGroups.sort((a, b) => a.rating - b.rating);
        return ratingGroups;
    };

    get entityType() {
        if (this.props.location.pathname.includes("show")) {
            if (this.props.match.params.season)
                return "season";
            return "tv";
        }
        if (this.props.location.pathname.includes("movie")) {
            return "movie";
        } else
            return console.log("ERROR")
    }

    getDataForMovie = async (movie_id) => {
        let movieData = this.props.store.getMovieInfo(movie_id);
        let userMovieData = this.props.store.getUsersEntityDetail(movie_id, "movie");
        const result = await Promise.all([movieData, userMovieData]);
        movieData = result[0];
        userMovieData = result[1];
        if (userMovieData) {
            userMovieData.rating_groups = this.normalizeRatings(userMovieData.rating_groups);
            userMovieData.max_one_rating = Math.max.apply(Math, userMovieData.rating_groups.map(e => e.count));
        }
        document.title = movieData.title;
        const OMDB_data = await this.props.store.getMovieInfoOMDB(movieData.imdb_id);
        if (OMDB_data.Response === "False") {
            movieData.ratings = [];
        } else {
            movieData.ratings = this.props.store.getRatings(OMDB_data);
        }
        return {data: movieData, userData: userMovieData}
    };
    getDataForShow = async (show_id) => {
        if (this.props.match.params.season) {
            let seasonData = this.props.store.getSeasonInfo(show_id, this.props.match.params.season);
            let userSeasonData = this.props.store.getUsersEntityDetail(show_id, "season", this.props.match.params.season);
            const result = await Promise.all([seasonData, userSeasonData]);
            seasonData = result[0];
            userSeasonData = result[1];
            if (userSeasonData) {
                userSeasonData.rating_groups = this.normalizeRatings(userSeasonData.rating_groups);
                userSeasonData.max_one_rating = Math.max.apply(Math, userSeasonData.rating_groups.map(e => e.count));
            }
            document.title = seasonData.name;
            seasonData.ratings = {};
            seasonData.id = this.props.match.params.entity_id;
            return {data: seasonData, userData: userSeasonData}
        } else {
            let showData = this.props.store.getShowInfo(show_id);
            let userShowData = this.props.store.getUsersEntityDetail(show_id, "tv");
            const result = await Promise.all([showData, userShowData]);
            showData = result[0];
            userShowData = result[1];
            if (userShowData) {
                userShowData.rating_groups = this.normalizeRatings(userShowData.rating_groups);
                userShowData.max_one_rating = Math.max.apply(Math, userShowData.rating_groups.map(e => e.count));
            }
            document.title = showData.name;
            showData.ratings = {};
            return {data: showData, userData: userShowData}
        }
    };
    updateWithNewEntity = () => {
        this.setState({loadingData: true}, async () => {
            const {entity_id} = this.props.match.params;
            let datas;
            if (this.entityType === "movie") {
                datas = await this.getDataForMovie(entity_id);
            }
            if (this.entityType === "tv" || this.entityType === "season") {
                datas = await this.getDataForShow(entity_id);
            }
            this.setState({
                data: datas.data,
                userData: datas.userData,
                loadingData: false,
                entityType: this.entityType
            });
        });
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.match.params.entity_id !== this.props.match.params.entity_id || prevProps.match.params.season !== this.props.match.params.season) {
            window.scroll(0, 0);
            this.updateWithNewEntity();
        }
    }

    componentDidMount() {
        window.scroll(0, 0);
        window.addEventListener('resize', this.onWindowResize);
        this.updateWithNewEntity();
    }

    updateMovieUserData = (type, val) => {
        let message;
        if (type === "liked") {
            if (val) {
                message = "🙂 Movie Liked"
            } else {
                message = "🙁 Movie Unliked"
            }
        }
        if (type === "viewed") {
            if (val) {
                message = "🙉 Movie Viewed"
            } else {
                message = "🙈 Movie Unviewed"
            }
        }
        if (type === "saved") {
            if (val) {
                message = "💾 Movie Saved"
            } else {
                message = "🚫 Movie Removed"
            }
        }
        if (type !== "rating") {
            toast.info(message, {
                position: "top-right",
                autoClose: 1500,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                draggable: true,
            });
        }
        if (this.entityType === "season") {
            this.props.store.updateMovieUserData(this.props.match.params.entity_id, type, val, this.entityType, this.state.data.poster_path, this.state.data.release_date || this.state.data.first_air_date || this.state.data.air_date, this.state.data.title || this.state.data.name, this.props.match.params.season);
        } else {
            this.props.store.updateMovieUserData(this.state.data.id, type, val, this.entityType, this.state.data.poster_path, this.state.data.release_date || this.state.data.first_air_date || this.state.data.air_date, this.state.data.title || this.state.data.name, this.props.match.params.season);
        }
        const updatedState = {...this.state.userData};
        updatedState[type] = val;
        this.setState({userData: updatedState})
    };
    updateReviewDate = (review, date_watched) => {
        this.setState(prevState => ({userData: {...prevState.userData, review, date_watched}}))
    };
    updateVReview = (v_rating) => {
        if (v_rating !== -1) {
            this.setState(prevState => ({userData: {...prevState.userData, v_rating: {rating: v_rating}}}))
        }
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        if (window.innerWidth < 830 && !this.state.smallWindow) {
            this.setState({smallWindow: true});
        }
        if (window.innerWidth >= 830 && this.state.smallWindow) {
            this.setState({smallWindow: false});
        }
        if (window.innerWidth < 1111 && !this.state.kindaSmallWindow) {
            this.setState({kindaSmallWindow: true});
        }
        if (window.innerWidth >= 1111 && this.state.kindaSmallWindow) {
            this.setState({kindaSmallWindow: false});
        }
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        if (Object.entries(this.state.data).length > 0)
            return (
                <div className="movie-page-full">
                    <ReviewModal type={this.state.entityType} updateVReview={this.updateVReview}
                                 updateReviewDate={this.updateReviewDate}
                                 smallWindow={this.state.smallWindow}
                                 userData={this.state.userData}
                                 movie={this.state.data}
                                 open={this.state.reviewModalOpen}
                                 season={this.props.match.params.season}
                                 close={() => this.setState({reviewModalOpen: false})}/>
                    <div
                        style={{backgroundImage: `url(${this.props.store.getImageURL(this.state.data.backdrop_path || this.state.data.poster_path)})`}}
                        className="movie-backdrop"/>
                    <div
                        className={`mr-1 ml-1 movie-content d-flex ${this.state.smallWindow ? "flex-column" : "flex-row"} justify-content-center`}>
                        <div
                            className={`movie-poster d-flex flex-column mr-2 ${this.state.smallWindow && "align-items-center"}`}>
                            <ImageWithLoading type={this.state.entityType} width={250}
                                              imgStyle="movie-page-poster"
                                              src={this.props.store.getImageURL(this.state.data.poster_path, this.props.store.poster_sizes[3])}/>
                            {this.state.entityType === "movie" && (
                                <div className="d-flex flex-row justify-content-between ratings mt-2">
                                    <div className="d-flex flex-row mr-1">
                                        <img alt="" className="mr-1" height={25}
                                             src="//i.imgur.com/2Sle5QI.png"/>
                                        <span>{this.state.data.ratings.imdb || "N/A"}</span>
                                    </div>
                                    <div className="d-flex flex-row">
                                        {this.state.data.ratings.rt ?
                                            parseInt(this.state.data.ratings.rt.slice(0, -1)) < 60 ?
                                                <img alt="" className="mr-1" height={25}
                                                     src="//i.imgur.com/6oR2eKa.png"/>
                                                :
                                                <img alt="" className="mr-1" height={25}
                                                     src="//i.imgur.com/FugNdUf.png"/>
                                            : <img alt="" className="mr-1" height={25}
                                                   src="//i.imgur.com/FugNdUf.png"/>
                                        }
                                        <span>{this.state.data.ratings.rt || "N/A"}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="movie-info d-flex flex-column">
                            <div
                                className={`d-flex ${this.state.smallWindow ? "flex-column" : "flex-row"} align-items-center movie-title-d-y`}>
                                <div
                                    className="movie-title smaller-title-media">{this.state.entityType === "movie" ? this.state.data.title : this.state.data.name}</div>
                                {this.state.entityType === "movie" &&
                                (<div className="movie-director-year">
                                    Directed
                                    by {this.props.store.getDirectors(this.state.data.credits).map((director, i, arr) => {
                                    return (<span key={director.id}>{director.name}{arr.length - 1 !== i && (
                                        <span>, </span>)}</span>)
                                })} | <span>{this.state.data.release_date.substring(0, 4)}</span>
                                </div>)}
                                {this.state.entityType === "tv" &&
                                (<div className="movie-director-year">
                                    Created
                                    by {this.state.data.created_by.map((creator, i, arr) => {
                                    return (
                                        <span key={creator.id}>{creator.name}{arr.length - 1 !== i && (
                                            <span>, </span>)}</span>
                                    )
                                })} | <span>{this.state.data.first_air_date.substring(0, 4)}</span>
                                </div>)
                                }
                                {this.state.entityType === "season" &&
                                (<div className="movie-director-year">
                                    <span>{this.state.data.air_date.substring(0, 4)}</span>
                                </div>)}
                            </div>

                            <div className="d-flex flex-row">
                                <div
                                    className={`d-flex flex-column ${this.state.smallWindow ? "align-items-center" : "align-items-start"}`}>
                                    <div className="tag-line">{this.state.data.tagline}</div>
                                    <div className="move-description-detail">{this.state.data.overview}</div>

                                    {!this.state.kindaSmallWindow && this.state.entityType === "tv" && (
                                        <div className="seasons-slider-div">
                                            <SeasonsScroller seasons={this.state.data.seasons}
                                                             show_id={this.state.data.id}
                                                             size={this.props.store.poster_sizes[3]}
                                                             getImageURL={this.props.store.getImageURL}/>
                                        </div>
                                    )}
                                    {this.state.smallWindow && (
                                        <div className="d-flex flex-column">
                                            {this.props.store.user.token ?
                                                <div style={{
                                                    minHeight: this.state.userData.v_rating ? 400 : 300,
                                                    maxHeight: this.state.userData.v_rating ? 400 : 300
                                                }} className="movie-actions small-actions d-flex flex-column">
                                                    <div
                                                        className="d-flex flex-row movie-actions-icons justify-content-between">
                                                        <div
                                                            className="d-flex flex-column align-items-center movie-actions-icon"
                                                            onClick={() => {
                                                                if (this.state.userData.review || this.state.userData.date_watched) {
                                                                    this.setState({reviewModalOpen: true})
                                                                } else {
                                                                    this.updateMovieUserData("viewed", !this.state.userData["viewed"])
                                                                }
                                                            }}>
                                                            {this.props.store.viewedOrReviewed(this.state.userData) ?
                                                                <i className="fas fa-eye icon-blue"/> :
                                                                <i className="far fa-eye"/>}
                                                            <span
                                                                className="action-icon-text">{this.props.store.viewedOrReviewed(this.state.userData) ? this.state.userData.review ? "Reviewed" : "Viewed" : "View"}</span>
                                                        </div>
                                                        <div
                                                            className="d-flex flex-column align-items-center movie-actions-icon"
                                                            onClick={() => this.updateMovieUserData("liked", !this.state.userData["liked"])}>
                                                            {this.state.userData.liked ?
                                                                <i className="fas fa-laugh-beam icon-yellow"/> :
                                                                <i className="far fa-laugh-beam"/>}
                                                            <span
                                                                className="action-icon-text">{this.state.userData.liked ? "Liked" : "Like"}</span>
                                                        </div>
                                                        <div
                                                            className="d-flex flex-column align-items-center movie-actions-icon"
                                                            onClick={() => this.updateMovieUserData("saved", !this.state.userData["saved"])}>
                                                            {this.state.userData.saved ?
                                                                <i className="fas fa-save icon-green"/> :
                                                                <i className="far fa-save"/>}
                                                            <span
                                                                className="action-icon-text">{this.state.userData.saved ? "Saved" : "Save"}</span>
                                                        </div>
                                                    </div>

                                                    <div
                                                        className="d-flex flex-column align-items-center justify-content-center action-rating">
                                                        <span className="rating-text">Your Rating</span>
                                                        <RatingComponent initialRating={this.state.userData.rating}
                                                                         onChange={(val) => this.updateMovieUserData("rating", val)}/>
                                                    </div>
                                                    {this.state.userData.v_rating && (
                                                        <div
                                                            className="d-flex flex-column align-items-center justify-content-center v-rating">
                                                            <span className="rating-text">Vernikoff Rating</span>
                                                            <span
                                                                className="v-rating-text">{this.props.store.vernikoff_ratings[this.state.userData.v_rating.rating]}</span>
                                                        </div>
                                                    )}
                                                    <div className="d-flex flex-column align-items-center review"
                                                         onClick={() => {
                                                             window.scrollTo(0, 0);
                                                             this.setState({reviewModalOpen: !this.state.reviewModalOpen})
                                                         }}>
                                                        <span>{(this.state.userData.date_watched || this.state.userData.review) ? "Edit Review..." : "Review..."}</span>
                                                    </div>
                                                </div>
                                                :
                                                <div
                                                    className="movie-actions-not-logged-in d-flex flex-column justify-content-center align-items-center">
                                                    {this.state.userData.v_rating && (
                                                        <div
                                                            className="d-flex flex-column align-items-center justify-content-center v-rating">
                                                            <span className="rating-text">Vernikoff Rating</span>
                                                            <span
                                                                className="v-rating-text">{this.props.store.vernikoff_ratings[this.state.userData.v_rating.rating]}</span>
                                                        </div>
                                                    )}
                                                    <span><Link to='/login'
                                                                style={{color: 'inherit'}}>Please login to review...</Link></span>
                                                </div>
                                            }
                                            {parseInt(this.state.userData.total_ratings) > 0 ? (
                                                    <div className="ratings-chart small-actions">
                                                        <div
                                                            className="ratings-label d-flex flex-row justify-content-between align-items-end">
                                                            <span className="ratings-rating-text">Ratings</span>
                                                            <span
                                                                className="ratings-rating-total">Total: {this.state.userData.total_ratings}</span>
                                                        </div>
                                                        <div className="average-rating">
                                                            {Number.parseFloat(this.state.userData.average_rating).toFixed(1)}
                                                        </div>
                                                        <BarChart width={250} height={100}
                                                                  data={this.state.userData.rating_groups}>
                                                            <YAxis hide={true} axisLine={false} type="number"
                                                                   domain={[0, this.state.userData.max_one_rating]}/>
                                                            <Bar dataKey="count" fill="#8884d8"/>
                                                        </BarChart>
                                                    </div>
                                                )
                                                :
                                                (
                                                    <span className="no-ratings-yet">No Ratings...</span>
                                                )
                                            }
                                        </div>
                                    )}
                                    <PersonCast credits={this.state.data.credits}
                                                created_by={this.state.data.created_by}
                                                size={this.props.store.poster_sizes[3]}
                                                getImageURL={this.props.store.getImageURL}/>
                                    {this.state.kindaSmallWindow && this.state.entityType === "tv" && (
                                        <>
                                            <span className="related-movie-text border-bottom">Seasons</span>
                                            <div
                                                className="related-movie-entitites d-flex flex-row flex-wrap justify-content-center">
                                                {this.state.data.seasons.filter(season => season.season_number > 0 && season.air_date !== null).map(season => {
                                                    return (
                                                        <ImageWithLoading type={"season"} width={85}
                                                                          imgStyle="seasons-slider-movie poster-usual"
                                                                          makeLink={true}
                                                                          movie_id={this.state.data.id}
                                                                          key={season.id}
                                                                          season_number={season.season_number}
                                                                          src={this.props.store.getImageURL(season.poster_path, this.props.store.poster_sizes[3])}/>
                                                    )
                                                })}
                                            </div>
                                        </>
                                    )}
                                    {(this.state.entityType === "movie" || this.state.entityType === "tv") && (
                                        <>
                                            <span className="related-movie-text border-bottom">Related</span>
                                            <div
                                                className="related-movie-entitites d-flex flex-row flex-wrap justify-content-center">
                                                {this.state.data.similar.results.map(similar =>
                                                    <ImageWithLoading type={this.state.entityType} width={100}
                                                                      key={similar.id}
                                                                      imgStyle="related-movie poster-usual"
                                                                      makeLink={true}
                                                                      movie_id={similar.id}
                                                                      src={this.props.store.getImageURL(similar.poster_path, this.props.store.poster_sizes[3])}/>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>
                                {!this.state.smallWindow && (
                                    <div className="d-flex flex-column">
                                        {this.props.store.user.token ?
                                            <div style={{
                                                minHeight: this.state.userData.v_rating ? 400 : 300,
                                                maxHeight: this.state.userData.v_rating ? 400 : 300
                                            }} className="movie-actions d-flex flex-column">
                                                <div
                                                    className="d-flex flex-row movie-actions-icons justify-content-between">
                                                    <div
                                                        className="d-flex flex-column align-items-center movie-actions-icon"
                                                        onClick={() => {
                                                            if (this.state.userData.review || this.state.userData.date_watched) {
                                                                this.setState({reviewModalOpen: true})
                                                            } else {
                                                                this.updateMovieUserData("viewed", !this.state.userData["viewed"])
                                                            }
                                                        }}>
                                                        {this.props.store.viewedOrReviewed(this.state.userData) ?
                                                            <i className="fas fa-eye icon-blue"/> :
                                                            <i className="far fa-eye"/>}
                                                        <span
                                                            className="action-icon-text">{this.props.store.viewedOrReviewed(this.state.userData) ? this.state.userData.review ? "Reviewed" : "Viewed" : "View"}</span>
                                                    </div>
                                                    <div
                                                        className="d-flex flex-column align-items-center movie-actions-icon"
                                                        onClick={() => this.updateMovieUserData("liked", !this.state.userData["liked"])}>
                                                        {this.state.userData.liked ?
                                                            <i className="fas fa-laugh-beam icon-yellow"/> :
                                                            <i className="far fa-laugh-beam"/>}
                                                        <span
                                                            className="action-icon-text">{this.state.userData.liked ? "Liked" : "Like"}</span>
                                                    </div>
                                                    <div
                                                        className="d-flex flex-column align-items-center movie-actions-icon"
                                                        onClick={() => this.updateMovieUserData("saved", !this.state.userData["saved"])}>
                                                        {this.state.userData.saved ?
                                                            <i className="fas fa-save icon-green"/> :
                                                            <i className="far fa-save"/>}
                                                        <span
                                                            className="action-icon-text">{this.state.userData.saved ? "Saved" : "Save"}</span>
                                                    </div>
                                                </div>

                                                <div
                                                    className="d-flex flex-column align-items-center justify-content-center action-rating">
                                                    <span className="rating-text">Your Rating</span>
                                                    <RatingComponent initialRating={this.state.userData.rating}
                                                                     onChange={(val) => this.updateMovieUserData("rating", val)}/>
                                                </div>
                                                {this.state.userData.v_rating && (
                                                    <div
                                                        className="d-flex flex-column align-items-center justify-content-center v-rating">
                                                        <span className="rating-text">Vernikoff Rating</span>
                                                        <span
                                                            className="v-rating-text">{this.props.store.vernikoff_ratings[this.state.userData.v_rating.rating]}</span>
                                                    </div>
                                                )}
                                                <div className="d-flex flex-column align-items-center review"
                                                     onClick={() => this.setState({reviewModalOpen: !this.state.reviewModalOpen})}>
                                                    <span>{(this.state.userData.date_watched || this.state.userData.review) ? "Edit Review..." : "Review..."}</span>
                                                </div>
                                            </div>
                                            :
                                            <div
                                                className="movie-actions-not-logged-in d-flex flex-column justify-content-center align-items-center">
                                                {this.state.userData.v_rating && (
                                                    <div
                                                        className="d-flex flex-column align-items-center justify-content-center v-rating">
                                                        <span className="rating-text">Vernikoff Rating</span>
                                                        <span
                                                            className="v-rating-text">{this.props.store.vernikoff_ratings[this.state.userData.v_rating.rating]}</span>
                                                    </div>
                                                )}
                                                <span><Link to='/login'
                                                            style={{color: 'inherit'}}>Please login to review...</Link></span>
                                            </div>
                                        }
                                        {parseInt(this.state.userData.total_ratings) > 0 ? (
                                                <div className="ratings-chart">
                                                    <div
                                                        className="ratings-label d-flex flex-row justify-content-between align-items-end">
                                                        <span className="ratings-rating-text">Ratings</span>
                                                        <span
                                                            className="ratings-rating-total">Total: {this.state.userData.total_ratings}</span>
                                                    </div>
                                                    <div className="average-rating">
                                                        {Number.parseFloat(this.state.userData.average_rating).toFixed(1)}
                                                    </div>
                                                    <BarChart width={250} height={100}
                                                              data={this.state.userData.rating_groups}>
                                                        <YAxis hide={true} axisLine={false} type="number"
                                                               domain={[0, this.state.userData.max_one_rating]}/>
                                                        <Bar dataKey="count" fill="#8884d8"/>
                                                    </BarChart>
                                                </div>
                                            )
                                            :
                                            (
                                                <span className="no-ratings-yet">No Ratings...</span>
                                            )
                                        }
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            );
        else
            return (
                <div/>
            )
    }
}

export default withRouter(inject("store")(observer(ShowMoviePage)));
