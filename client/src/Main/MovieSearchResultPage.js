import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Loader from '../Misc/Loader';
import Pagination from '../Misc/Pagination';
import ImageWithLoading from '../Misc/ImageWithLoading';
import MovieSearchResult from '../Misc/MovieSearchResult';

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
        return (
            <div className="d-flex flex-column align-items-center movie-page">
                <div className="movie-results d-flex flex-column align-items-start">
                    <div>Found {this.state.totalResults} results for "{decodeURIComponent(this.state.term)}"</div>
                    {this.state.searchResults.map(entity => {
                        return (
                            <MovieSearchResult entity={entity} poster_size={this.props.store.poster_sizes[2]}
                                               getImageURL={this.props.store.getImageURL}/>
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
