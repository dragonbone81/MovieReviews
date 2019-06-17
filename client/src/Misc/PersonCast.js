import React, {useState} from 'react';
import PersonCastPill from '../Misc/PersonCastPill';

const producers = ["Production Supervisor", "Producer", "Executive Producer", "Executive Producer", "Production Supervisor"];
const PersonCast = ({credits, getImageURL, size, production_companies, networks, doNotShowDetails}) => {
    const [selectedPill, setSelectedPill] = useState("cast");
    const [expandedCast, setExpandedCast] = useState(false);
    return (
        <div className="movie-people">
            <div className="people-div-options border-bottom">
                <span onClick={() => setSelectedPill("cast")}
                      className={` ${selectedPill === "cast" ? "people-div-selected" : "people-div"}`}>Cast</span>
                <span onClick={() => setSelectedPill("crew")}
                      className={` ${selectedPill === "crew" ? "people-div-selected" : "people-div"}`}>Crew</span>
                <span onClick={() => setSelectedPill("details")}
                      className={` ${selectedPill === "details" ? "people-div-selected" : "people-div"}`}>Details</span>
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
                <div className="movie-cast d-flex flex-column">
                    <CrewSection title={"Directors"}
                                 getImageURL={getImageURL}
                                 size={size}
                                 items={credits.crew.filter(crew => crew.job === "Director")}/>
                    <CrewSection title={"Producers"}
                                 getImageURL={getImageURL}
                                 size={size}
                                 items={credits.crew.filter(crew => producers.includes(crew.job))}/>
                    <CrewSection title={"Writers"}
                                 getImageURL={getImageURL}
                                 size={size}
                                 items={credits.crew.filter(crew => crew.job === "Writer" || crew.job === "Story" || crew.job === "Screenplay").filter((thing, index, self) =>
                                     index === self.findIndex((t) => (
                                         t.id === thing.id
                                     ))
                                 )}/>
                    <CrewSection title={"Score"}
                                 getImageURL={getImageURL}
                                 size={size}
                                 items={credits.crew.filter(crew => crew.job === "Original Music Composer" || crew.job === "Music")}/>
                </div>
            )}
            {selectedPill === "details" && !doNotShowDetails && (
                <div className="movie-cast d-flex flex-column">
                    <CrewSection title={"Studios"}
                                 getImageURL={getImageURL}
                                 size={size}
                                 items={production_companies}/>
                    <CrewSection title={"Networks"}
                                 getImageURL={getImageURL}
                                 size={size}
                                 items={networks}/>
                    {/*<CrewSection title={"Producers"}*/}
                    {/*getImageURL={getImageURL}*/}
                    {/*size={size}*/}
                    {/*items={credits.crew.filter(crew => producers.includes(crew.job))}/>*/}
                    {/*<CrewSection title={"Writers"}*/}
                    {/*getImageURL={getImageURL}*/}
                    {/*size={size}*/}
                    {/*items={credits.crew.filter(crew => crew.job === "Writer" || crew.job === "Story" || crew.job === "Screenplay").filter((thing, index, self) =>*/}
                    {/*index === self.findIndex((t) => (*/}
                    {/*t.id === thing.id*/}
                    {/*))*/}
                    {/*)}/>*/}
                </div>
            )}
        </div>
    )
};
const CrewSection = ({title, items, getImageURL, size}) => {
    if (items.length === 0)
        return <></>;
    return (
        <div className="d-flex flex-row crew-div-inner">
            <div className="cast-titles">{title}.....</div>
            <div className="d-flex flex-row flex-wrap crew-section justify-content-end">
                {items.map(person =>
                    <PersonCastPill
                        size={size}
                        key={`${person.id} ${person.job}`}
                        id={person.id}
                        getImageURL={getImageURL}
                        url={person.profile_path || person.logo_path}
                        character={person.job}
                        type={person.type}
                        actor={person.name}/>)}
            </div>
        </div>
    )
};
export default PersonCast;