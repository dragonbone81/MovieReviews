import React, {useState} from 'react';

const ImageWithLoading = ({src, width}) => {
    const height = width * (3 / 2);
    const [loading, setLoading] = useState(true);
    const [couldNotLoad, setCouldNotLoad] = useState(false);
    return (
        <div>
            {loading ? (
                <div style={{width, height, textAlign: "center", margin: 'auto', fontSize: 20}}>
                    <i className="fas fa-spinner fa-spin"/>
                </div>
            ) : null}
            <img width={100} height={height}
                 src={couldNotLoad ? "https://i.imgur.com/zhdC9CX.jpg" : src}
                 alt="Movie poster"
                 style={loading ? {display: 'none'} : {}}
                 onLoad={() => setLoading(false)}
                 onError={() => setCouldNotLoad(true)}
            />
        </div>
    )
};
export default ImageWithLoading;