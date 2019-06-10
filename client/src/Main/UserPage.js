import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Switch, Route, Link} from 'react-router-dom';
import WatchedMovies from '../UserPages/WatchedMovies'
import SortingComponent from '../Misc/SortingComponent'
import HistoryMovies from '../UserPages/HistoryMovies'
import MovieReviewPage from '../UserPages/MovieReviewPage'
import ReviewMovies from '../UserPages/ReviewMovies'
import SavedMovies from '../UserPages/SavedMovies'

class UserPage extends Component {
    initStateSort = {created_at: "desc", rating: "desc"};
    sortTypes = [{id: "movie", name: "Movies"}, {id: "tv", name: "Shows"}, {id: "season", name: "Seasons"}, {
        id: "all",
        name: "All"
    }];
    state = {
        page: "",
        readOnly: true,
        sort: {...this.initStateSort},
        sortType: "created_at",
        sortDirection: "desc",
        sortShown: false,
        typeSort: 3,
    };

    componentDidMount() {
        this.updatePage();
    }

    updatePage = () => {
        const page = this.props.location.pathname.split("/").slice(2)[0];
        let readOnly = true;
        if (this.props.store.user.username === this.props.match.params.username) {
            readOnly = false;
        }
        this.setState({page, readOnly});
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.location.pathname.slice(0, -1) !== prevProps.location.pathname.slice(0, -1)) {
            this.setState({
                sortType: "created_at",
                sortDirection: "desc",
                // sortShown: false,
                sort: {...this.initStateSort}
            });
            this.updatePage();
        }
    }

    changeSortType = (type) => {
        if (!this.state.sortShown)
            return;
        this.setState({sortType: type});
    };
    changeSortDirection = (type, direction) => {
        if (!this.state.sortShown)
            return;
        const newSortType = {};
        newSortType[type] = direction;
        this.setState(prevState => ({sort: {...prevState.sort, ...newSortType}}))
    };
    changeTypeSort = () => {
        if (!this.state.sortShown)
            return;
        let typeSort = this.state.typeSort + 1;
        if (typeSort > 3) {
            typeSort = 0;
        }
        this.setState({typeSort});
    };

    render() {
        return (
            <div className="user-page">
                <div className="user-page-content">
                    <div className="d-flex flex-row user-page-nav">
                        <div className="user-page-nav-username">{this.props.match.params.username}</div>
                        <Link
                            to={`/user/movies/${this.props.match.params.username}`}
                            style={{textDecoration: 'none', color: '#9badbb'}}
                            className={`user-page-nav-nib border-right ${this.state.page === "movies" ? "active" : ""}`}>Watched
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
                        <Link
                            to={`/user/saved/${this.props.match.params.username}`}
                            style={{textDecoration: 'none', color: '#9badbb'}}
                            className={`user-page-nav-nib  mr-auto ${this.state.page === "saved" ? "active" : ""}`}>Saved
                        </Link>
                        <div
                            onClick={() => this.setState(prevState => ({sortShown: !prevState.sortShown}))}
                            className="user-page-nav-nib border-left">
                            <i className="fas fa-filter"/>
                        </div>
                    </div>
                    <div className="">
                        <SortingComponent typeName={this.sortTypes[this.state.typeSort].name}
                                          changeTypeSort={this.changeTypeSort} sortType={this.state.sortType}
                                          changeSortDirection={this.changeSortDirection}
                                          sort={this.state.sort}
                                          changeSortType={this.changeSortType} sortShown={this.state.sortShown}/>
                        <Switch>
                            <Route exact path="/user/movies/:username/:page?"
                                   render={(props) => <WatchedMovies {...props}
                                                                     typeSort={this.sortTypes[this.state.typeSort].id}
                                                                     sortDirection={this.state.sort[this.state.sortType]}
                                                                     sortType={this.state.sortType}
                                                                     readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/history/:username/:page?"
                                   render={(props) => <HistoryMovies {...props}
                                                                     typeSort={this.sortTypes[this.state.typeSort].id}
                                                                     sortDirection={this.state.sort[this.state.sortType]}
                                                                     sortType={this.state.sortType}
                                                                     readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/saved/:username/:page?"
                                   render={(props) => <SavedMovies {...props}
                                                                     typeSort={this.sortTypes[this.state.typeSort].id}
                                                                     sortDirection={this.state.sort[this.state.sortType]}
                                                                     sortType={this.state.sortType}
                                                                     readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/review/:username/:entity_type/:movie_id/:season?"
                                   render={(props) => <MovieReviewPage {...props}
                                                                       readOnly={this.state.readOnly}/>}/>
                            <Route exact path="/user/reviews/:username/:page?"
                                   render={(props) => <ReviewMovies {...props}
                                                                    typeSort={this.sortTypes[this.state.typeSort].id}
                                                                    sortDirection={this.state.sort[this.state.sortType]}
                                                                    sortType={this.state.sortType}
                                                                    readOnly={this.state.readOnly}/>}/>
                        </Switch>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(UserPage)));
