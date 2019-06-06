import React, {useState} from 'react';
import {Link} from 'react-router-dom';

const ImageWithLoading = ({sortShown, changeSortType}) => {
    return (
        <div className={`d-flex flex-row align-items-center sorting-div box ${sortShown ? "" : "hidden"}`}>
            <div className="sorting-div-nib border-right">Date</div>
            <div onClick={() => changeSortType("rating")} className="sorting-div-nib">Rating</div>
        </div>
    )
};
export default ImageWithLoading;