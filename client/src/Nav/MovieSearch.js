import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';

class MovieSearch extends Component {
    state = {
        searchValue: "",
        inputFocused: false,
        searchResults: [],
    };
    search = ({target}) => {
        if (target.value === "") {
            this.setState({searchValue: "", searchResults: []});
            return;
        }
        this.setState({searchValue: target.value}, async () => {
            const data = await this.props.store.searchForMovies(this.state.searchValue);
            this.setState({
                searchResults: data.results.sort((a, b) => {
                    return b.popularity - a.popularity
                })
            });
        });
    };

    render() {
        return (
            <div className="nav-bar-form">
                <form className="form-inline ml-2">
                    <input value={this.state.searchValue}
                           onChange={this.search} className="form-control"
                           onFocus={() => this.setState({inputFocused: true})}
                           // onBlur={() => this.setState({inputFocused: false})}
                           type="search" placeholder="Search" aria-label="Search"/>
                    {/*<button className="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>*/}
                </form>
                {this.state.inputFocused && this.state.searchResults.length > 0 && (
                    <ul className="list-group list-group-flush search-results">
                        {this.state.searchResults.map(result => {
                            return (
                                <li onClick={() => this.props.history.push(`/movie/${result.id}`)}
                                    className="list-group-item">{result.title} ({result.release_date.substring(0, 4)})</li>)
                        })}
                    </ul>
                )}
            </div>
        )
    }
}

export default withRouter(inject("store")(observer(MovieSearch)));