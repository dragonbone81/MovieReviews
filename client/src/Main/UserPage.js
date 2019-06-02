import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import WatchedMovies from '../UserPages/WatchedMovies'
import HistoryMovies from '../UserPages/HistoryMovies'
import Login from "../Auth/Login";
import MoviePage from "./MoviePage";
import SignUp from "../Auth/SignUp";
import Home from "./Home";
import MovieSearchResultPage from "./MovieSearchResultPage";

class UserPage extends Component {
    state = {
        page: ""
    };

    componentDidMount() {
        this.updatePage();
    }

    updatePage = () => {
        const page = this.props.location.pathname.split("/").slice(-1)[0];
        this.setState({page});
    }

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
                            <Route exact path="/user/:username/movies" component={WatchedMovies}/>
                            <Route exact path="/user/:username/history" component={HistoryMovies}/>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(UserPage)));
