import React, {useState} from 'react';
import {Link} from 'react-router-dom';
import PersonCastPill from '../Misc/PersonCastPill';

const PersonCast = ({credits, getImageURL, size, created_by}) => {
    const [selectedPill, setSelectedPill] = useState("cast");
    return (
        <div className="movie-people">
            <div className="people-div-options border-bottom">
                <span onClick={() => setSelectedPill("cast")}
                      className={` ${selectedPill === "cast" ? "people-div-selected" : "people-div"}`}>Cast</span>
                <span onClick={() => setSelectedPill("crew")}
                      className={` ${selectedPill === "crew" ? "people-div-selected" : "people-div"}`}>Crew</span>
            </div>
            {selectedPill === "cast" && (
                <div className="movie-cast d-flex flex-row flex-wrap">
                    {credits.cast.map(person => {
                        return (
                            <PersonCastPill size={size}
                                            id={person.id}
                                            getImageURL={getImageURL}
                                            url={person.profile_path}
                                            character={person.character} actor={person.name}/>
                        )
                    })}
                </div>
            )}
            {selectedPill === "crew" && (
                <div className="movie-cast d-flex flex-row flex-wrap">
                    {credits.crew.length>0?credits.crew.map(person => {
                        return (
                            <PersonCastPill size={size}
                                            id={person.id}
                                            getImageURL={getImageURL}
                                            url={person.profile_path}
                                            character={person.job} actor={person.name}/>
                        )
                    })
                        :
                        created_by.map(person => {
                            return (
                                <PersonCastPill size={size}
                                                id={person.id}
                                                getImageURL={getImageURL}
                                                url={person.profile_path}
                                                character={person.job} actor={person.name}/>
                            )
                        })
                    }
                </div>
            )}
        </div>
    )
};
export default PersonCast;