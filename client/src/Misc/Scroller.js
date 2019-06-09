import React from 'react';
import ImageWithLoading from '../Misc/ImageWithLoading';

const Scroller = ({content, getImageURL, size, width, scrollAmt, imageCSS, scrollerWidth, type}) => {
    let modal = null;
    const scroll = (amt) => {
        modal.scroll({
            left: modal.scrollLeft + amt,
            behavior: 'smooth'
        });
    };
    return (
        <div className="d-flex flex-row">
            <span className={`seasons-slider-arrow`} onClick={() => scroll(-scrollAmt)}>
                <i className="fas fa-chevron-left"/>
            </span>
            <div ref={el => modal = el} className="d-flex flex-row seasons-slider"
                 style={{maxWidth: scrollerWidth, minWidth: 0}}>
                {content.map(thing => {
                    return (
                        <ImageWithLoading type={type} width={width}
                                          imgStyle={imageCSS}
                                          makeLink={true}
                                          movie_id={thing.id}
                                          key={thing.id}
                                          src={getImageURL(thing.poster_path, size)}/>
                    )
                })}
            </div>
            <span className={`seasons-slider-arrow`} onClick={() => scroll(scrollAmt)}>
                <i className="fas fa-chevron-right seasons-slider-arrow-right"/>
            </span>
        </div>
    )
};
export default Scroller;