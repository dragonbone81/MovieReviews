import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

class Home extends Component {
    state = {

    };

    componentDidMount() {
        document.title = "Sign Up";
    }



    render() {
        return (
            <div className="card card-body register-box">

            </div>
        );
    }
}

export default withRouter(inject("store")(observer(Home)));
