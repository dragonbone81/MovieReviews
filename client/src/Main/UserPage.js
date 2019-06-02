import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import WatchedMovies from '../UserPages/WatchedMovies'

class UserPage extends Component {
    state = {
        page: "watched"
    };

    async componentDidMount() {
        const {username} = this.props.match.params
        // console.log(username)

    }


    render() {
        return (
            <div className="user-page">
                <div className="user-page-content">
                    <ul className="nav nav-tabs user-page-nav">
                        <li className="nav-item">
                            <a className="nav-link active">Watched</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Link</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Link</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link">Disabled</a>
                        </li>
                    </ul>
                    <div>
                        {this.state.page === "watched" && <WatchedMovies/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(UserPage)));
