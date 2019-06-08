import React, {Component} from "react";
import {observer, inject} from 'mobx-react';
import {withRouter} from 'react-router-dom';
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
        this.setState({loadingData: true});
        if (newLoad) {
            const actorData = await this.props.store.getActorInfo(actor_id);
            const cast_crew = [...actorData.combined_credits.cast, ...actorData.combined_credits.crew].filter((thing, index, self) =>
                index === self.findIndex((t) => (
                    t.id === thing.id
                ))
            );
            this.setState({
                loadingData: false,
                actorData,
                movieData: cast_crew.sort((a, b) => b.popularity - a.popularity),
                page,
                totalPages: Math.ceil(cast_crew.length / 50)
            });
            document.title = actorData.name;
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
                <span className="actor-page-name">{this.state.actorData.name}</span>
                <div className="actor-movie-results d-flex flex-row flex-wrap">
                    {this.state.movieData.slice((this.state.page - 1) * 50, (this.state.page) * 50).map(movie => {
                        return (
                            <div key={movie.id} className="">
                                <div style={{padding: 10}}>
                                    <ImageWithLoading width={200} imgStyle="movie-poster-actor-list-movies"
                                                      movie_id={movie.id}
                                                      type={movie.media_type}
                                                      makeLink={true}
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
