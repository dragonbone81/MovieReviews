import React from "react";

const Loader = () => {
    return (
        <div className="loading-spinner">
            <div className="d-flex flex-row justify-content-center">
                <i className="fas fa-spinner fa-spin"/>
            </div>
        </div>
    );
};

export default Loader;
