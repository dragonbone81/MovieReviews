import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';

class ReviewModal extends Component {
    state = {};

    componentDidMount() {
        document.addEventListener('mousedown', this.click, false);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.click, false);
    }

    click = (e) => {
        if (!this.modal.contains(e.target)) {
            this.props.close();
        }
    };

    render() {
        return (
            <div>
                {this.props.open && <div className="backdrop"/>}
                <div
                    className={this.props.open ? "modal-made-trans scale-up-center" : "modal-made-close slide-out-right"}
                    id="modal" ref={el => {
                    this.modal = el;
                }}>
                    <h2>Modal Window</h2>
                    <div className="content">asddddddasd</div>
                    <div className="actions">
                        <button className="toggle-button" onClick={this.onClose}>
                            close
                        </button>
                    </div>
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(ReviewModal)));
