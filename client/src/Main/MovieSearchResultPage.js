import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Loader from '../Misc/Loader';

class MovieSearchResultPage extends Component {
    state = {
        totalResults: 0,
        totalPages: 0,
        term: "",
        page: 1,
        searchResults: [],
        searching: false
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.term !== prevProps.match.params.term || this.props.match.params.page !== prevProps.match.params.page) {
            const {term, page} = this.props.match.params;
            this.setState({term: term, page: parseInt(page) || 1});
            if (term) {
                this.setState({searching: true});
                const results = await this.props.store.searchForMovies(term, page);
                console.log(results)
                this.setState({
                    totalResults: results.total_results,
                    totalPages: Math.min(results.total_pages, 1000),
                    searchResults: results.results,
                    searching: false,
                });
            }
        }
    }

    async componentDidMount() {
        const {term, page} = this.props.match.params;
        this.setState({term: term, page: parseInt(page) || 1});
        if (term) {
            this.setState({searching: true});
            const results = await this.props.store.searchForMovies(term, page);
            console.log(results)
            this.setState({
                totalResults: results.total_results,
                totalPages: Math.min(results.total_pages, 1000),
                searchResults: results.results,
                searching: false,
            });
        }
    }


    render() {
        if (this.state.searching) {
            return (<Loader/>)
        }
        const middle_pages = [];
        for (let i = (Math.max(this.state.page - 3, 1)); i <= Math.min(this.state.page + 3, this.state.totalPages); i++) {
            middle_pages.push(i);
        }
        return (
            <div className="d-flex flex-column align-items-center movie-page">
                <div className="movie-results d-flex flex-column align-items-start">
                    <div>Found {this.state.totalResults} results for "{decodeURIComponent(this.state.term)}"</div>
                    {this.state.searchResults.map(movie => {
                        return (
                            <div key={movie.id} className="d-flex flex-row movie-results-list-item">
                                <div>
                                    <img width={100} src={this.props.store.getImageURL(movie.poster_path)}
                                         className="movie-poster-image-list" alt="Movie poster"/>
                                </div>
                                <div className="d-flex flex-column movie-list-content">
                                    <div className="d-flex flex-row">
                                        <span className="movie-title-list"><Link
                                            style={{textDecoration: 'none', color: 'white'}}
                                            to={`/movie/${movie.id}`}><span
                                            className="movie-list-title-link">{movie.title}</span></Link></span>
                                        <span
                                            className="movie-release-year-list">{movie.release_date.substring(0, 4)}</span>
                                    </div>
                                    <div className="movie-list-description">{movie.overview}</div>
                                </div>

                            </div>
                        )
                    })}
                </div>
                {this.state.totalPages && (
                    <div className="d-flex flex-row pagination justify-content-between">
                        <button className="btn btn-dark btn-sm dark-button pagination-nav-button">Previous</button>
                        <div className="d-flex flex-row align-items-center">
                            {this.state.page >= 5 && (
                                <Link style={{textDecoration: 'none', color: 'white'}} className="pagination-page"
                                      to={`/search/${this.props.match.params.term}/${1}`}><span>{1}</span></Link>
                            )}
                            {this.state.page > 5 && (
                                <span className="seperator-pagination">...</span>
                            )}
                            {middle_pages.map((value, i) => {
                                if (value === this.state.page) {
                                    return (
                                        <span key={i} className="pagination-page selected">{value}</span>
                                    )
                                } else {
                                    return (
                                        <Link key={i} style={{textDecoration: 'none', color: 'white'}}
                                              className="pagination-page"
                                              to={`/search/${this.props.match.params.term}/${value}`}><span>{value}</span></Link>
                                    )
                                }
                            })}
                            {this.state.page + 3 < this.state.totalPages && (
                                <span className="seperator-pagination">...</span>)}
                            {this.state.page + 3 < this.state.totalPages && (
                                <Link style={{textDecoration: 'none', color: 'white'}} className="pagination-page"
                                      to={`/search/${this.props.match.params.term}/${this.state.totalPages}`}><span>{this.state.totalPages}</span></Link>)}
                        </div>
                        <button className="btn btn-dark btn-sm dark-button pagination-nav-button">Next</button>
                    </div>
                )}
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(MovieSearchResultPage)));
