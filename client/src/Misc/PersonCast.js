import React, {useState} from 'react';
import PersonCastPill from '../Misc/PersonCastPill';

const PersonCast = ({credits, getImageURL, size, created_by}) => {
    const [selectedPill, setSelectedPill] = useState("cast");
    const [expandedCast, setExpandedCast] = useState(false);
    const [expandedCrew, setExpandedCrew] = useState(false);
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
                    {credits.cast.slice(0, expandedCast ? credits.cast.length + 1 : 20).map(person => {
                        return (
                            <PersonCastPill size={size}
                                            key={`${person.id} ${person.job}`}
                                            id={person.id}
                                            getImageURL={getImageURL}
                                            url={person.profile_path}
                                            character={person.character} actor={person.name}/>
                        )
                    })}
                    {credits.cast.length > 20 && (
                        <div onClick={() => setExpandedCast(!expandedCast)} className="person-cast-pill-div"><span
                            className="person-cast-pill">{expandedCast ? "Less..." : "More..."}</span></div>
                    )}
                </div>
            )}
            {selectedPill === "crew" && (
                <div className="movie-cast d-flex flex-row flex-wrap">
                    {credits.crew.length > 0 ? credits.crew.slice(0, expandedCrew ? credits.crew.length + 1 : 20).map(person => {
                            return (
                                <PersonCastPill size={size}
                                                key={`${person.id} ${person.job}`}
                                                id={person.id}
                                                getImageURL={getImageURL}
                                                url={person.profile_path}
                                                character={person.job} actor={person.name}/>
                            )
                        })
                        :
                        created_by.slice(0, expandedCrew ? credits.crew.length + 1 : 20).map(person => {
                            return (
                                <PersonCastPill size={size}
                                                key={`${person.id} ${person.job}`}
                                                id={person.id}
                                                getImageURL={getImageURL}
                                                url={person.profile_path}
                                                character={person.job} actor={person.name}/>
                            )
                        })
                    }
                    {credits.crew.length > 20 && (
                        <div onClick={() => setExpandedCrew(!expandedCrew)} className="person-cast-pill-div"><span
                            className="person-cast-pill">{expandedCrew ? "Less..." : "More..."}</span></div>
                    )}
                </div>
            )}
        </div>
    )
};
export default PersonCast;