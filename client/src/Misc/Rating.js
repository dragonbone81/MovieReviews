import React from "react";
import Rating from 'react-rating'
import {toast} from 'react-toastify';

const RatingComponent = ({initialRating, onChange, readOnly = false}) => {
    const onChangeRating = (val) => {
        onChange(val);
        toast.info("⭐ Movie Rated!", {
            position: "top-right",
            autoClose: 1500,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: true,
        });
    };
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
            onChange={onChangeRating}
        />
    );
};

export default RatingComponent;
