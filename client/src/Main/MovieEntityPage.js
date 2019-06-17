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
        smallWindow: window.innerWidth < 660,
    };

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.match.params.page !== prevProps.match.params.page) {
            this.updatePage(false);
        }
    }

    get type() {
        if (this.props.match.params.actor_id) {
            return "actor"
        }
        if (this.props.match.params.studio_id) {
            return "studio"
        }
        if (this.props.match.params.network_id) {
            return "network"
        }
        else
            return console.log("ERROR");
    }

    updatePage = async (newLoad = true) => {
        const {actor_id, studio_id, network_id} = this.props.match.params;
        const page = parseInt(this.props.match.params.page) || 1;
        this.setState({loadingData: true});
        if (newLoad || this.type === "studio") {
            if (this.type === "studio") {
                window.scrollTo(0, 0);
                const studioData = await this.props.store.getStudioInfo(studio_id, page);
                this.setState({
                    loadingData: false,
                    actorData: {},
                    movieData: studioData.results,
                    page,
                    totalPages: studioData.total_pages
                });
                document.title = "Studio";
            } else if (this.type === "network") {
                window.scrollTo(0, 0);
                const studioData = await this.props.store.getNetworkInfo(network_id, page);
                this.setState({
                    loadingData: false,
                    actorData: {},
                    movieData: studioData.results,
                    page,
                    totalPages: studioData.total_pages
                });
                document.title = "Network";
            } else {
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
            }
        } else {
            this.setState({
                loadingData: false,
                page,
            });
        }
    };

    componentDidMount() {
        window.addEventListener('resize', this.onWindowResize);
        this.updatePage().then(() => window.scrollTo(0, 0));
    }

    onWindowResize = () => {
        if (window.innerWidth < 660 && !this.state.smallWindow) {
            this.setState({smallWindow: true});
        }
        if (window.innerWidth >= 660 && this.state.smallWindow) {
            this.setState({smallWindow: false});
        }
    };

    render() {
        if (this.state.loadingData) {
            return (<Loader/>)
        }
        const list = this.type === "actor" ? this.state.movieData.slice((this.state.page - 1) * 50, (this.state.page) * 50) : this.state.movieData;
        return (
            <div className="d-flex flex-column align-items-center movie-page">
                <div className={`d-flex align-items-start ${this.state.smallWindow ? "flex-column" : "flex-row"}`}>
                    {this.type === "actor" && (
                        <div className="d-flex flex-column align-items-center actor-bio">
                            <ImageWithLoading width={150} imgStyle="actor-bio-poster"
                                              src={this.props.store.getImageURL(this.state.actorData.profile_path, this.props.store.poster_sizes[3])}/>
                            <span className="actor-page-name">{this.state.actorData.name}</span>
                            <p className="actor-page-bio-bio">{this.state.actorData.biography}</p>
                        </div>
                    )}
                    <div className="actor-movie-results d-flex flex-row flex-wrap">
                        {list.map(movie => {
                            return (
                                <div key={movie.id}
                                     className="d-flex flex-column align-items-center movie-person-movie">
                                    <ImageWithLoading width={200}
                                                      imgStyle="movie-poster-actor-list-movies poster-usual"
                                                      movie_id={movie.id}
                                                      type={movie.media_type || (this.type === "studio" && "movie") || (this.type === "network" && "tv")}
                                                      makeLink={true}
                                                      src={this.props.store.getImageURL(movie.poster_path, this.props.store.poster_sizes[3])}/>
                                    <span>{(movie.job && (`${movie.job.length > 18 ? `${movie.job.slice(0, 18)}...` : movie.job}`)) || (movie.character && (`${movie.character.length > 18 ? `${movie.character.slice(0, 18)}...` : movie.character}`)) || (movie.title && (`${movie.title.length > 18 ? `${movie.title.slice(0, 18)}...` : movie.title}`)) || (movie.name && (`${movie.name.length > 18 ? `${movie.name.slice(0, 18)}...` : movie.name}`))}</span>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Pagination
                    url={`/${this.type === "actor" ? "person" : this.type}/${this.props.match.params.actor_id || this.props.match.params.studio_id || this.props.match.params.network_id}`}
                    page={this.state.page}
                    totalPages={this.state.totalPages}/>
            </div>
        );
    }
}

export default withRouter(inject("store")(observer(MovieEntityPage)));
