import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import MovieSearch from './MovieSearch';

class NavBar extends Component {
    render() {
        console.log(this.props)
        return (
            <div
                className={`${this.props.location.pathname.startsWith("/movie/") ? "trans-nav-movie-view" : "trans-nav"} d-flex flex-row align-items-center`}>
                <div
                    className="ml-auto mr-auto d-flex flex-row align-items-center nav-bar-content justify-content-between">
                    <span>C-Views</span>
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
                        {/*{this.props.store.userLoggedIn && (*/}
                        {/*<Link className="" to="/logout">Logout</Link>*/}
                        {/*)}*/}
                        {/*<li className="nav-item">*/}
                        {/*<span className="navbar-text">User: {this.props.store.user.username}</span>*/}
                        {/*</li>*/}

                        {/*</div>*/}
                        <MovieSearch/>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(inject("store")(observer(NavBar)));