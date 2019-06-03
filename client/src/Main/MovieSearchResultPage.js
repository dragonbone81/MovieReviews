import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Loader from '../Misc/Loader';
import Pagination from '../Misc/Pagination';

class MovieSearchResultPage extends Component {
    state = {
        totalResults: 0,
        totalPages: 0,
        term: "",
        page: 1,
        searchResults: [],
        searching: false
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.term !== prevProps.match.params.term || this.props.match.params.page !== prevProps.match.params.page) {
            this.updatePage();
        }
    }

    updatePage = async () => {
        const {term, page} = this.props.match.params;
        document.title = `Search results for ${term}`;
        this.setState({term: term, page: parseInt(page) || 1});
        if (term) {
            this.setState({searching: true});
            const results = await this.props.store.searchForMovies(term, page);
            this.setState({
                totalResults: results.total_results,
                totalPages: Math.min(results.total_pages, 1000),
                searchResults: results.results,
                searching: false,
            });
        }
    };

    componentDidMount() {
        this.updatePage();
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
                <Pagination url={`/search/${this.props.match.params.term}`} page={this.state.page}
                            totalPages={this.state.totalPages}/>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(MovieSearchResultPage)));
