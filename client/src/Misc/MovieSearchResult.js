import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import ImageWithLoading from '../Misc/ImageWithLoading';

const MovieSearchResult = ({entity, poster_size, getImageURL}) => {
    if (entity.media_type === "movie") {
        const movie = entity;
        return (
            <div key={movie.id} className="d-flex flex-row movie-results-list-item">
                <div className="d-flex flex-row align-items-center">
                    <ImageWithLoading makeLink={true} movie_id={movie.id} width={100}
                                      imgStyle="movie-poster-image-list"
                                      src={getImageURL(movie.poster_path, poster_size)}/>
                </div>
                <div className="d-flex flex-column movie-list-content">
                    <div className="d-flex flex-row">
                                        <span className="movie-title-list"><Link
                                            style={{textDecoration: 'none', color: 'white'}}
                                            to={`/movie/${movie.id}`}><span
                                            className="movie-list-title-link">{movie.title}</span></Link></span>
                        <span
                            className="movie-release-year-list">{movie.release_date.substring(0, 4)}</span>
                    </div>
                    <div className="movie-list-description">{movie.overview}</div>
                </div>

            </div>
        );
    }
    if (entity.media_type === "tv") {
        const tv_show = entity;
        return (
            <div key={tv_show.id} className="d-flex flex-row movie-results-list-item">
                <div className="d-flex flex-row align-items-center">
                    <ImageWithLoading makeLink={true} movie_id={tv_show.id} width={100}
                                      imgStyle="movie-poster-image-list"
                                      src={getImageURL(tv_show.poster_path, poster_size)}/>
                </div>
                <div className="d-flex flex-column movie-list-content">
                    <div className="d-flex flex-row">
                        <div className="movie-title-list">
                            <Link
                                style={{textDecoration: 'none', color: 'white'}}
                                to={`/show/${tv_show.id}`}>
                                <span className="movie-list-title-link">{tv_show.name}</span>
                            </Link>
                        </div>
                        <span
                            className="movie-release-year-list">{tv_show.first_air_date.substring(0, 4)}</span>
                    </div>
                    <div className="movie-list-description">{tv_show.overview}</div>
                </div>

            </div>
        )
    } else return <div/>
};
export default MovieSearchResult;