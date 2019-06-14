import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import {observer, inject} from 'mobx-react';

class Footer extends Component {
    render() {
        return (
            <div className="footer">
                <div
                    className="d-flex flex-row">
                    <span
                        className="mr-auto">
                        <Link to="/vrated"
                              style={{color: 'inherit'}}>
                            My Ratings
                        </Link>
                    </span>
                    <span
                        className="">
                        &copy; Copyright {(new Date().getFullYear())} | V-Ratings 🎥
                    </span>
                </div>
            </div>
        )
    }
}

export default withRouter(inject("store")(observer(Footer)));