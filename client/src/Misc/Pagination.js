import React from "react";
import {Link} from "react-router-dom";
import {withRouter} from 'react-router-dom';

const Pagination = ({totalPages, page, url, link = true, callback = null, history}) => {
    const middle_pages = [];
    for (let i = (Math.max(page - 3, 1)); i <= Math.min(page + 3, totalPages); i++) {
        middle_pages.push(i);
    }
    return (
        <div className="pagination">
            {totalPages > 0 && (
                <div className="d-flex flex-row justify-content-between">
                    <button
                        disabled={page === 1}
                        onClick={() => link ? history.push(`${url}/${page !== 1 && page - 1}`) : callback(page !== 1 && page - 1)}
                        className="btn btn-dark btn-sm dark-button pagination-nav-button">Previous
                    </button>
                    <div className="d-flex flex-row align-items-center">
                        {page >= 5 && (
                            link ? (
                                    <Link style={{textDecoration: 'none', color: 'white'}} className="pagination-page"
                                          to={`${url}/${1}`}><span>{1}</span></Link>
                                ) :
                                (
                                    <span onClick={() => callback(1)} className="pagination-page white">{1}</span>
                                )
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
                                if (link) {
                                    return (
                                        <Link key={i} style={{textDecoration: 'none', color: 'white'}}
                                              className="pagination-page"
                                              to={`${url}/${value}`}><span>{value}</span></Link>
                                    )
                                } else {
                                    return <span key={i} onClick={() => callback(value)}
                                                 className="pagination-page white">{value}</span>
                                }
                            }
                        })}
                        {page + 3 < totalPages && (
                            <span className="seperator-pagination">...</span>)}
                        {page + 3 < totalPages && (
                            link ? (
                                    <Link style={{textDecoration: 'none', color: 'white'}} className="pagination-page"
                                          to={`${url}/${totalPages}`}><span>{totalPages}</span></Link>
                                ) :
                                (
                                    <span onClick={() => callback(totalPages)}
                                          className="pagination-page white">{totalPages}</span>
                                )
                        )}
                    </div>
                    <button
                        disabled={page === totalPages}
                        onClick={() => link ? history.push(`${url}/${page !== totalPages && page + 1}`) : callback(page !== totalPages && page + 1)}
                        className="btn btn-dark btn-sm dark-button pagination-nav-button">Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default withRouter(Pagination);