import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import WatchedMovies from '../UserPages/WatchedMovies'
import HistoryMovies from '../UserPages/HistoryMovies'

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
                    <div className="d-flex flex-row user-page-nav">
                        <div className="user-page-nav-username">{this.props.match.params.username}</div>
                        <div
                            onClick={() => this.setState({page: "watched"})}
                            className={`user-page-nav-nib border-right ${this.state.page === "watched" ? "active" : ""}`}>Watched
                        </div>
                        <div
                            onClick={() => this.setState({page: "history"})}
                            className={`user-page-nav-nib border-right ${this.state.page === "history" ? "active" : ""}`}>History
                        </div>
                        <div className="user-page-nav-nib border-right">Reviews</div>
                        <div className="user-page-nav-nib border-right">Saved</div>
                        <div className="user-page-nav-nib">Liked</div>
                    </div>
                    <div>
                        {this.state.page === "watched" && <WatchedMovies/>}
                        {this.state.page === "history" && <HistoryMovies/>}
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(UserPage)));
