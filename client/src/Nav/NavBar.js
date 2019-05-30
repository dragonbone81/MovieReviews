import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import MovieSearch from './MovieSearch';

class NavBar extends Component {
    render() {
        return (
            <div
                className={`trans-nav d-flex flex-row align-items-center`}>
                <div className="ml-auto mr-auto d-flex flex-row align-items-center nav-bar-content justify-content-between">
                    <span>C-Views</span>
                    <div className="d-flex flex-row ml-auto align-items-center">
                        {this.props.store.userLoggedIn && (
                            <span className="username">{this.props.store.user.username}</span>
                        )}

                        {!this.props.store.userLoggedIn && (
                            <Link className="" to="/login">Login</Link>
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