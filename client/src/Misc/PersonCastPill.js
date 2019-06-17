import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import ImageWithLoading from '../Misc/ImageWithLoading';

const PersonCastPill = ({actor, character, url, getImageURL, size, id, type}) => {
    const [mouseEnter, setMouseEnter] = useState(false);
    return (
        <div className="person-cast-pill-div">
            {!type && mouseEnter &&
            (
                <div
                    className="person-cast-pill-character d-flex flex-column justify-content-center align-items-center">
                    <span>{character}</span>
                    <ImageWithLoading type={"person"} width={150}
                                      imgStyle="movie-cast-pic"
                                      src={getImageURL(url, size)}/>
                </div>
            )}
            <Link style={{color: 'inherit', textDecoration: "none"}}
                  to={`/${type ? type : "person"}/${id}`}>
                <span onMouseEnter={() => setMouseEnter(true)} onMouseLeave={() => setMouseEnter(false)}
                      className="person-cast-pill">{actor}</span>
            </Link>
        </div>
    )
};
export default PersonCastPill;