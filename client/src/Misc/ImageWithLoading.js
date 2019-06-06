import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const ImageWithLoading = ({src, width, imgStyle, makeLink, movie_id}) => {
    const height = Math.ceil(width * (3 / 2));
    const [loading, setLoading] = useState(true);
    const [couldNotLoad, setCouldNotLoad] = useState(false);
    return (
        <>
            {loading ? (
                <div className={imgStyle} style={{width, height, textAlign: "center", fontSize: 30}}>
                    <i className="fas fa-spinner fa-spin"/>
                </div>
            ) : null}
            {makeLink ?
                <Link to={`/movie/${movie_id}`}>
                    <img className={imgStyle} width={width} height={height}
                         src={couldNotLoad ? "https://i.imgur.com/zhdC9CX.jpg" : src}
                         alt="Movie poster"
                         style={loading ? {display: 'none'} : {}}
                         onLoad={() => setLoading(false)}
                         onError={() => setCouldNotLoad(true)}
                    />
                </Link>
                :
                <img className={imgStyle} width={width} height={height}
                     src={couldNotLoad ? "https://i.imgur.com/zhdC9CX.jpg" : src}
                     alt="Movie poster"
                     style={loading ? {display: 'none'} : {}}
                     onLoad={() => setLoading(false)}
                     onError={() => setCouldNotLoad(true)}
                />
            }
        </>
    )
};
export default ImageWithLoading;