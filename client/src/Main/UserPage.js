import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import WatchedMovies from '../UserPages/WatchedMovies'
import HistoryMovies from '../UserPages/HistoryMovies'
import MovieReviewPage from '../UserPages/MovieReviewPage'
import ReviewMovies from '../UserPages/ReviewMovies'

class UserPage extends Component {
    state = {
        page: "",
        readOnly: true,
        sortMode: {type: "date_created", direction: "desc"},
        sortShown: false,
    };

    componentDidMount() {
        this.updatePage();
    }

    updatePage = () => {
        const page = this.props.location.pathname.split("/").slice(2)[0];
        console.log(this.props.match.params)
        let readOnly = true;
        if (this.props.store.user.username === this.props.match.params.username) {
            readOnly = false;
        }
        this.setState({page, readOnly});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.pathname !== prevProps.location.pathname) {
            this.updatePage();
        }
    }


    render() {
        return (
            <div className="user-page">
                <div className="user-page-content">
                    <div className="d-flex flex-row user-page-nav">
                        <div className="user-page-nav-username">{this.props.match.params.username}</div>
                        <Link
                            to={`/user/movies/${this.props.match.params.username}`}
                            style={{textDecoration: 'none', color: '#9badbb'}}
                            className={`user-page-nav-nib border-right ${this.state.page === "movies" ? "active" : ""}`}>Movies
                        </Link>
                        <Link
                            to={`/user/history/${this.props.match.params.username}`}
                            style={{textDecoration: 'none', color: '#9badbb'}}
                            className={`user-page-nav-nib border-right ${this.state.page === "history" ? "active" : ""}`}>History
                        </Link>
                        <Link
                            to={`/user/reviews/${this.props.match.params.username}`}
                            style={{textDecoration: 'none', color: '#9badbb'}}
                            className={`user-page-nav-nib border-right ${this.state.page === "reviews" ? "active" : ""}`}>Reviews
                        </Link>
                        <div className="user-page-nav-nib border-right">Saved</div>
                        <div className="user-page-nav-nib mr-auto">Liked</div>
                        <div onClick={() => this.setState(prevState => ({sortShown: !prevState.sortShown}))}
                             className="user-page-nav-nib border-left">Sort
                        </div>
                        <div
                             style={{visibility: this.state.sortShown ? "visible" : "hidden"}}
                             className="d-flex flex-column sorting-selection">
                            <span>Date</span>
                            <span>Rating</span>
                        </div>
                    </div>
                    <div>
                        <Switch>
                            <Route exact path="/user/movies/:username/:page?"
                                   render={(props) => <WatchedMovies {...props} readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/history/:username/:page?"
                                   render={(props) => <HistoryMovies {...props} readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/review/:username/:movie_id"
                                   render={(props) => <MovieReviewPage {...props} readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/reviews/:username/:page?"
                                   render={(props) => <ReviewMovies {...props} readOnly={this.state.readOnly}/>}/>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(UserPage)));
