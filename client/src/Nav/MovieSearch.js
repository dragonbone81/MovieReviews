import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';

class MovieSearch extends Component {
    state = {
        searchValue: "",
    };
    search = (e) => {
        e.preventDefault();
        this.setState({searchValue: ""});
    };

    render() {
        return (
            <div className="nav-bar-form">
                <form className="form-inline ml-2" onSubmit={this.search}>
                    <input value={this.state.searchValue}
                           onChange={({target}) => this.setState({searchValue: target.value})}
                           className="form-control form-control-sm search"
                           type="text" placeholder="Search" aria-label="Search"/>
                </form>
            </div>
        )
    }
}

export default withRouter(inject("store")(observer(MovieSearch)));