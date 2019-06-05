import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter, Link} from 'react-router-dom';
import Loader from '../Misc/Loader';
import Pagination from '../Misc/Pagination';
import ImageWithLoading from '../Misc/ImageWithLoading';

class MovieEntityPage extends Component {
    state = {
        actorData: {},
        movieData: {},
        loadingData: true,
        page: 1,
    };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.page !== prevProps.match.params.page) {
            this.updatePage(false);
        }
    }

    updatePage = async (newLoad = true) => {
        const {actor_id} = this.props.match.params;
        const page = parseInt(this.props.match.params.page) || 1;
        // document.title = `Search results for ${term}`;
        this.setState({loadingData: true});
        if (newLoad) {
            const actorData = await this.props.store.getActorInfo(actor_id);
            this.setState({
                loadingData: false,
                actorData,
                movieData: actorData.movie_credits.cast.sort((a, b) => b.popularity - a.popularity),
                page,
                totalPages: Math.ceil(actorData.movie_credits.cast.length / 50)
            });
        } else {
            window.scrollTo(0, 0);
            this.setState({
                loadingData: false,
                page,
            });
        }
    };

    componentDidMount() {
        this.updatePage();
    }


    render() {
        if (this.state.loadingData) {
            return (<Loader/>)
        }
        return (
            <div className="d-flex flex-column align-items-center movie-page">
                <div className="actor-movie-results d-flex flex-row flex-wrap">
                    {this.state.movieData.slice((this.state.page - 1) * 50, (this.state.page) * 50).map(movie => {
                        return (
                            <div key={movie.id} className="">
                                <div style={{padding: 10}}>
                                    <ImageWithLoading width={200} imgStyle="movie-poster-actor-list-movies"
                                                      src={this.props.store.getImageURL(movie.poster_path, this.props.store.poster_sizes[3])}/>
                                </div>
                            </div>
                        )
                    })}
                </div>
                <Pagination url={`/actor/${this.props.match.params.actor_id}`} page={this.state.page}
                            totalPages={this.state.totalPages}/>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(MovieEntityPage)));
