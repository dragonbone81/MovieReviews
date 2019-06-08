import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import ImageWithLoading from '../Misc/ImageWithLoading';

const SeasonsScroller = ({seasons, getImageURL, size}) => {
    const [mouseEnter, setMouseEnter] = useState(false);
    let modal = null;
    const scroll = (amt) => {
        modal.scroll({
            left: modal.scrollLeft + amt,
            behavior: 'smooth'
        });
    };
    const actualSeasons = [...seasons.filter(season => season.season_number > 0), ...seasons.filter(season => season.season_number < 1)];
    return (
        <div className="d-flex flex-row">
            <span className="seasons-slider-arrow" onClick={() => scroll(-336)}>
                <i className="fas fa-chevron-left"/>
            </span>
            <div ref={el => modal = el} className="d-flex flex-row seasons-slider">
                {actualSeasons.map(season => {
                    return (
                        <ImageWithLoading type={"season"} width={158}
                                          imgStyle="seasons-slider-movie"
                                          src={getImageURL(season.poster_path, size)}/>
                    )
                })}
            </div>
            <span className="seasons-slider-arrow" onClick={() => scroll(336)}>
                <i className="fas fa-chevron-right seasons-slider-arrow-right"/>
            </span>
        </div>
    )
};
export default SeasonsScroller;