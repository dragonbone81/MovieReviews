import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import Rating from "react-rating";
import Pagination from "../Misc/Pagination";
import Loader from "../Misc/Loader";

class HistoryMovies extends Component {
    state = {
        movies: [],
        page: 1,
        loadingData: false,
    };

    async componentDidMount() {
        this.updatePage();
    }

    updatePage = async () => {
        this.setState({loadingData: true});
        const {username} = this.props.match.params;
        const movie_data = await this.props.store.getHistoryMoviesForUser(username, this.state.page - 1);
        const movies = await this.props.store.getMultipleMovies(movie_data.results);
        this.setState({movies: movies, totalPages: Math.ceil(movie_data.total / 10), loadingData: false});
    };
    changePage = (page) => {
        this.setState({page: page}, () => {
            this.updatePage()
        });
    };
    getMonth = (date) => {
        return new Date(date).toLocaleString("default", {month: 'short'});
    };
    getDay = (date) => {
        return new Date(date).toLocaleString("default", {day: '2-digit'});
    };
    getYear = (date) => {
        return new Date(date).toLocaleString("default", {year: 'numeric'});
    };

    render() {
        if (this.state.loadingData) {
            return (
                <Loader/>
            )
        }
        return (
            <div className="d-flex flex-column justify-content-center align-items-center">
                <div className="d-flex flex-column justify-content-start align-items-start align-self-start history-col">
                    {this.state.movies.map(movie => {
                        return (
                            <div className="d-flex flex-row align-content-stretch justify-content-center align-items-center border-bottom history-row">
                                <div key={movie.movie_id}
                                     onClick={() => this.props.history.push(`/movie/${movie.movie_id}`)}
                                     className="watched-movie d-flex flex-column justify-content-center align-items-center">
                                    <img
                                        src={movie.poster_path ? this.props.store.getImageURL(movie.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                        className="img-history" alt="Movie poster"/>
                                </div>
                                <div className="calendar flex-fill">
                                    <i className="fas fa-calendar"/>
                                    <div className="cal-month-day">
                                        <div className="cal-month-day-inner d-flex flex-row">
                                            <span className="cal-month">{this.getMonth(movie.date_watched)}</span>
                                            <span className="cal-day">{this.getDay(movie.date_watched)}</span>
                                        </div>
                                    </div>
                                    <span className="cal-year">{this.getYear(movie.date_watched)}</span>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Pagination url={`/search/${this.props.match.params.term}`} page={this.state.page}
                            totalPages={this.state.totalPages} link={false} callback={this.changePage}/>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(HistoryMovies)));
