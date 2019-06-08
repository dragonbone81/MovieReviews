import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Switch, Route, Link, Redirect} from 'react-router-dom';
import WatchedMovies from '../UserPages/WatchedMovies'
import SortingComponent from '../Misc/SortingComponent'
import HistoryMovies from '../UserPages/HistoryMovies'
import MovieReviewPage from '../UserPages/MovieReviewPage'
import ReviewMovies from '../UserPages/ReviewMovies'

class UserPage extends Component {
    initStateSort = {created_at: "desc", rating: "desc"};
    sortTypes = [{id: "movie", name: "Movies"}, {id: "tv", name: "Shows"}, {id: "all", name: "All"}];
    state = {
        page: "",
        readOnly: true,
        sort: {...this.initStateSort},
        sortType: "created_at",
        sortDirection: "desc",
        sortShown: false,
        typeSort: 2,
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
        this.setState({sortType: type});
    };
    changeSortDirection = (type, direction) => {
        const newSortType = {};
        newSortType[type] = direction;
        this.setState(prevState => ({sort: {...prevState.sort, ...newSortType}}))
    };
    changeTypeSort = () => {
        let typeSort = this.state.typeSort + 1;
        if (typeSort > 2) {
            typeSort = 0;
        }
        this.setState({typeSort});
    };

    render() {
        const options = [
            'one', 'two', 'three'
        ];
        const defaultOption = options[0];
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
                        <div className="user-page-nav-nib border-right">Saved</div>
                        <div className="user-page-nav-nib mr-auto">Liked</div>
                        <div
                            onClick={() => this.setState(prevState => ({sortShown: !prevState.sortShown}))}
                            className="user-page-nav-nib border-left">
                            <i className="fas fa-filter"/>
                        </div>
                        {/*<Dropdown controlClassName='test'*/}
                        {/*menuClassName="test"*/}
                        {/*className="border-left" options={options} onChange={this._onSelect}*/}
                        {/*// value={defaultOption}*/}
                        {/*placeholder="Sort"/>*/}
                        {/**/}

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
                            <Route exact path="/user/review/:username/:entity_type/:movie_id"
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
