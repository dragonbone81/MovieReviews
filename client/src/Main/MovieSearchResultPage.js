import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';

class MovieSearchResultPage extends Component {
    state = {
        totalResults: 0,
        totalPages: 0,
        term: "",
        page: 1,
        searchResults: [],
    };

    async componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.term !== prevProps.match.params.term || this.props.match.params.page !== prevProps.match.params.page) {
            const {term, page} = this.props.match.params;
            this.setState({term: term, page: parseInt(page) || 1});
            if (term) {
                const results = await this.props.store.searchForMovies(term, page);
                console.log(results)
                this.setState({
                    totalResults: results.total_results,
                    totalPages: results.total_pages,
                    searchResults: results.results
                });
            }
        }
    }

    async componentDidMount() {
        const {term, page} = this.props.match.params;
        this.setState({term: term, page: parseInt(page) || 1});
        if (term) {
            const results = await this.props.store.searchForMovies(term, page);
            console.log(results)
            this.setState({
                totalResults: results.total_results,
                totalPages: results.total_pages,
                searchResults: results.results
            });
        }
    }


    render() {
        const middle_pages = [];
        for (let i = (Math.max(this.state.page - 3, 1)); i <= Math.min(this.state.page + 3, this.state.totalPages); i++) {
            middle_pages.push(i);
        }
        return (
            <div className="d-flex flex-column align-items-center">
                <div className="movie-results d-flex flex-column">
                    {this.state.searchResults.map(movie => {
                        return <div>{movie.title}</div>
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
                                return (
                                    <Link key={i} style={{textDecoration: 'none', color: 'white'}}
                                          className="pagination-page"
                                          to={`/search/${this.props.match.params.term}/${value}`}><span>{value}</span></Link>
                                )
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
