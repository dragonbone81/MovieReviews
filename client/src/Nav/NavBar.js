import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import MovieSearch from './MovieSearch';

class NavBar extends Component {
    render() {
        return (
            <div
                className={`${(this.props.location.pathname.startsWith("/movie/") || this.props.location.pathname.startsWith("/show/") || this.props.location.pathname === "/") ? "trans-nav-movie-view" : "trans-nav"} d-flex flex-row align-items-center`}>
                <div
                    className="ml-auto mr-auto d-flex flex-row align-items-center nav-bar-content justify-content-between">
                    <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>V-Ratings 🎥</Link>
                    <div className="d-flex flex-row ml-auto align-items-center">
                        {this.props.store.userLoggedIn && (
                            <Link to={`/user/movies/${this.props.store.user.username}`}
                                  style={{textDecoration: 'none', color: 'inherit'}}>
                                <span className="username">{this.props.store.user.username}</span>
                            </Link>
                        )}

                        {!this.props.store.userLoggedIn && (
                            <Link className="login-button" to="/login"
                                  style={{textDecoration: 'none'}}>Login</Link>
                        )}
                        <MovieSearch/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(inject("store")(observer(NavBar)));