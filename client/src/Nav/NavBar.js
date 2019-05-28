import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import MovieSearch from './MovieSearch';

class NavBar extends Component {
    render() {
        return (
            <nav className="navbar navbar-expand-md navbar-dark color-primary">
                {/*<button className="navbar-toggler" type="button" data-toggle="collapse"*/}
                {/*data-target="#navbarTogglerDemo01" aria-controls="navbarTogglerDemo01" aria-expanded="false"*/}
                {/*aria-label="Toggle navigation">*/}
                {/*<span className="navbar-toggler-icon"></span>*/}
                {/*</button>*/}
                {/*<div className="collapse navbar-collapse" id="navbarTogglerDemo01">*/}
                {/*<a className="navbar-brand" href="#">Hidden brand</a>*/}
                <ul className="navbar-nav mr-auto mt-0">
                    {/*<li className="nav-item active">*/}
                    {/*<a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>*/}
                    {/*</li>*/}
                    {/*<li className="nav-item">*/}
                    {/*<a className="nav-link" href="#">Link</a>*/}
                    {/*</li>*/}
                    {/*<li className="nav-item">*/}
                    {/*<a className="nav-link disabled" href="#">Disabled</a>*/}
                    {/*</li>*/}
                </ul>
                <ul className="navbar-nav ml-auto mr-1 mt-0">
                    {!this.props.store.userLoggedIn && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">Login</Link>
                        </li>
                    )}
                    {this.props.store.userLoggedIn && (
                        <li className="nav-item">
                            <Link className="nav-link" to="/logout">Logout</Link>
                        </li>
                    )}
                    {/*<li className="nav-item">*/}
                    {/*<span className="navbar-text">User: {this.props.store.user.username}</span>*/}
                    {/*</li>*/}
                </ul>
                {this.props.store.userLoggedIn && (
                    <span className="navbar-text">User: {this.props.store.user.username}</span>
                )}
                <MovieSearch/>
                {/*</div>*/}
            </nav>
        )
    }
}

export default inject("store")(observer(NavBar));