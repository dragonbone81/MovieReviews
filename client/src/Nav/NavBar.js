import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';
import MovieSearch from './MovieSearch';

class NavBar extends Component {
    state = {
        smallWindow: window.innerWidth < 480,
    };

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    onWindowResize = () => {
        if (window.innerWidth < 480 && !this.state.smallWindow) {
            this.setState({smallWindow: true});
        }
        if (window.innerWidth >= 480 && this.state.smallWindow) {
            this.setState({smallWindow: false});
        }
    };

    render() {
        return (
            <div className="over-nav">
                <div
                    className={`${(this.props.location.pathname.startsWith("/movie/") || this.props.location.pathname.startsWith("/show/") || this.props.location.pathname === "/") ? "trans-nav-movie-view" : "trans-nav"} d-flex flex-row align-items-center`}>
                    <div
                        className="ml-auto mr-auto d-flex flex-row align-items-center nav-bar-content justify-content-between">
                        <Link to="/" style={{textDecoration: 'none', color: 'inherit'}}>
                            <span role="img" aria-label="Title"
                                  className="pr-1">{this.state.smallWindow ? "🎥" : "V-Ratings 🎥"}</span>
                        </Link>
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
            </div>
        )
    }
}

export default withRouter(inject("store")(observer(NavBar)));