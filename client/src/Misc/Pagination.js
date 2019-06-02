import React from "react";
import {Link} from "react-router-dom";

const Pagination = ({totalPages, page, url}) => {
    const middle_pages = [];
    for (let i = (Math.max(page - 3, 1)); i <= Math.min(page + 3, totalPages); i++) {
        middle_pages.push(i);
    }
    return (
        <div className="pagination">
            <div className="d-flex flex-row pagination justify-content-between">
                <button className="btn btn-dark btn-sm dark-button pagination-nav-button">Previous</button>
                <div className="d-flex flex-row align-items-center">
                    {page >= 5 && (
                        <Link style={{textDecoration: 'none', color: 'white'}} className="pagination-page"
                              to={`${url}/${1}`}><span>{1}</span></Link>
                    )}
                    {
                        page > 5 && (
                            <span className="seperator-pagination">...</span>
                        )}
                    {middle_pages.map((value, i) => {
                        if (value === page) {
                            return (
                                <span key={i} className="pagination-page selected">{value}</span>
                            )
                        } else {
                            return (
                                <Link key={i} style={{textDecoration: 'none', color: 'white'}}
                                      className="pagination-page"
                                      to={`${url}/${value}`}><span>{value}</span></Link>
                            )
                        }
                    })}
                    {page + 3 < totalPages && (
                        <span className="seperator-pagination">...</span>)}
                    {page + 3 < totalPages && (
                        <Link style={{textDecoration: 'none', color: 'white'}} className="pagination-page"
                              to={`${url}/${totalPages}`}><span>{totalPages}</span></Link>)}
                </div>
                <button className="btn btn-dark btn-sm dark-button pagination-nav-button">Next</button>
            </div>
        </div>
    );
};

export default Pagination;
