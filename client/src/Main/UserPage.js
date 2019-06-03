import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import WatchedMovies from '../UserPages/WatchedMovies'
import HistoryMovies from '../UserPages/HistoryMovies'
import MovieReviewPage from '../UserPages/MovieReviewPage'

class UserPage extends Component {
    state = {
        page: "",
        readOnly: true,
    };

    componentDidMount() {
        this.updatePage();
    }

    updatePage = () => {
        const page = this.props.location.pathname.split("/").slice(-1)[0];
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
                            to={`/user/${this.props.match.params.username}/movies`}
                            style={{textDecoration: 'none', color: '#9badbb'}}
                            className={`user-page-nav-nib border-right ${this.state.page === "movies" ? "active" : ""}`}>Movies
                        </Link>
                        <Link
                            to={`/user/${this.props.match.params.username}/history`}
                            style={{textDecoration: 'none', color: '#9badbb'}}
                            className={`user-page-nav-nib border-right ${this.state.page === "history" ? "active" : ""}`}>History
                        </Link>
                        <div className="user-page-nav-nib border-right">Reviews</div>
                        <div className="user-page-nav-nib border-right">Saved</div>
                        <div className="user-page-nav-nib">Liked</div>
                    </div>
                    <div>
                        <Switch>
                            <Redirect exact from="/user/:username" to="/user/:username/movies"/>
                            <Route exact path="/user/:username/movies"
                                   render={(props) => <WatchedMovies {...props} readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/:username/history"
                                   render={(props) => <HistoryMovies {...props} readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/:username/:movie_id"
                                   render={(props) => <MovieReviewPage {...props} readOnly={this.state.readOnly}/>}/>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(UserPage)));
