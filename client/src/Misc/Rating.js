import React from "react";
import Rating from 'react-rating'

const RatingComponent = ({initialRating, onChange, readOnly = false}) => {
    return (
        <Rating
            readonly={readOnly}
            className=""
            emptySymbol="far fa-star empty-star"
            fullSymbol="fas fa-star"
            stop={10}
            step={2}
            fractions={2}
            initialRating={initialRating}
            onChange={onChange}
        />
    );
};

export default RatingComponent;
