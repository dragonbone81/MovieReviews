import React, {Component} from 'react';
import {withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';

class MovieSearch extends Component {
    state = {
        searchValue: "",
    };
    search = (e) => {
        e.preventDefault();
        this.props.history.push(`/search/${encodeURIComponent(this.state.searchValue)}`);
        this.textInput.blur();
    };

    render() {
        return (
            <form className="align-self-center" onSubmit={this.search}>
                <input ref={el => {
                    this.textInput = el;
                }} value={this.state.searchValue}
                       onChange={({target}) => this.setState({searchValue: target.value})}
                       className="form-control form-control-sm search"
                       type="text" placeholder="Search" aria-label="Search"/>
            </form>
        )
    }
}

export default withRouter(inject("store")(observer(MovieSearch)));