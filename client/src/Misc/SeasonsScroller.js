import React from 'react';
import ImageWithLoading from '../Misc/ImageWithLoading';

const SeasonsScroller = ({seasons, getImageURL, size, show_id, episode}) => {
    let modal = null;
    const scroll = (amt) => {
        modal.scroll({
            left: modal.scrollLeft + amt,
            behavior: 'smooth'
        });
    };
    const actualSeasons = [...seasons.filter(season => season.season_number > 0 && season.air_date !== null)];
    return (
        <div className="d-flex flex-row">
            <span className={`seasons-slider-arrow ${episode ? "less" : ""}`} onClick={() => scroll(-336)}>
                <i className="fas fa-chevron-left"/>
            </span>
            <div ref={el => modal = el} className="d-flex flex-row seasons-slider">
                {actualSeasons.map(season => {
                    return (
                        <ImageWithLoading type={"season"} width={158}
                                          imgStyle="seasons-slider-movie"
                                          makeLink={true}
                                          movie_id={show_id}
                                          key={season.id}
                                          season_number={season.season_number}
                                          episode={episode}
                                          src={getImageURL(episode ? season.still_path : season.poster_path, size)}/>
                    )
                })}
            </div>
            <span className={`seasons-slider-arrow ${episode ? "less" : ""}`} onClick={() => scroll(336)}>
                <i className="fas fa-chevron-right seasons-slider-arrow-right"/>
            </span>
        </div>
    )
};
export default SeasonsScroller;