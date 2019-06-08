import React from 'react';

const ImageWithLoading = ({sortType, sortShown, changeSortType, sort, changeSortDirection, changeTypeSort, typeName}) => {
    return (
        <div
            className={`d-flex flex-row align-items-center justify-content-center sorting-div box ${sortShown ? "" : "hidden"}`}>
            <RatingDiv name="Date" sort={sort} changeSortDirection={changeSortDirection} sortType={sortType}
                       changeSortType={changeSortType} type="created_at"/>
            <RatingDiv name="Rating" sort={sort} changeSortDirection={changeSortDirection} sortType={sortType}
                       changeSortType={changeSortType} type="rating"/>
            <RatingDivType changeTypeSort={changeTypeSort} typeName={typeName}/>
        </div>
    )
};
const RatingDivType = ({changeTypeSort, typeName}) => {
    return (
        <div
            className={`sorting-div-nib sorting-div-nib-active`}>
            <span onClick={changeTypeSort}>Type: {typeName}</span>
        </div>
    )
};
const RatingDiv = ({name, sort, type, sortType, changeSortType, changeSortDirection}) => {
    return (
        <div
            className={`sorting-div-nib d-flex flex-row align-items-center border-right ${sortType === type ? "sorting-div-nib-active" : ""}`}>
            <span onClick={() => changeSortType(type)}>{name}</span>
            {sortType === type && <div className="sorting-nib">
                <i onClick={() => sortType === type && changeSortDirection(type, sort[type] === "asc" ? "desc" : "asc")}
                   className={`fas fa-sort-up sorting-nib-icon ${sort[type]}`}/>
            </div>}
        </div>
    )
};
export default ImageWithLoading;