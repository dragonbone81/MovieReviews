import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.min.css"

class ReviewModal extends Component {
    state = {
        date: new Date(),
    };

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
                    {this.props.movie && (
                        <div className="review-modal-content">
                            <div className="d-flex flex-row movie-review-row">
                                <div>
                                    <img width={150}
                                         src={this.props.movie.poster_path ? this.props.store.getImageURL(this.props.movie.poster_path) : "https://i.imgur.com/IiA2iLz.png"}
                                         className="img-review" alt="Movie poster"/>
                                </div>
                                <div className="d-flex flex-column review-details">
                                    <span className="modal-you-watched">You watched...</span>
                                    <div className="d-flex flex-row align-items-start justify-content-start mm-ty">
                                        <span className="movie-modal-title">{this.props.movie.title}</span>

                                        <span
                                            className="movie-modal-year">{this.props.movie.release_date.substring(0, 4)}</span>
                                    </div>
                                    <div>
                                        <span className="modal-date-on">On:</span>
                                        <DatePicker
                                            className="date-choosing"
                                            selected={this.state.date}
                                            onChange={(date) => this.setState({date})}
                                            maxDate={new Date()}
                                        />
                                    </div>
                                    <textarea className="review-text" rows="3" placeholder="Your review..."/>
                                </div>
                            </div>
                            <div className="d-flex flex-row-reverse">
                                <button type="button" className="btn btn-success submit-review">Save</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(ReviewModal)));
