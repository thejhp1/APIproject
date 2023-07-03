import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { thunkGetEventDetail } from "../../store/groups";



export const GroupDetailPageEvents = ({events, group}) => {
    const upcomingEvent = []
    const pastEvent = [];
    const time = new Date();

    for (let event of events) {
        console.log('asd', event.startDate.split("T")[0])
        // let asd = event.startDate.split("T")
        // event["startDate"] = 'asd'
        // console.log(asd)
        if (event.previewImage === undefined){
            event.previewImage = "https://vishwaentertainers.com/wp-content/uploads/2020/04/No-Preview-Available.jpg"
        }
        if (new Date(event.startDate) > time) {
        upcomingEvent.push(event);
        } else {
        pastEvent.push(event);
        }
    }


    return (
        <>
            <h2 style={{marginTop:"0px", marginBottom:"0px"}}>{upcomingEvent.length > 0 ? `Upcoming Events (${upcomingEvent.length})` : ""}</h2>

            {upcomingEvent.map(event =>
                <>
                <div className="event-cards">
                    <div className="event-cards-image">
                        <img src={event.previewImage} width={180} height={120} style={{marginLeft:"1rem", marginTop:"1.25rem"}}></img>
                    </div>
                    <div className="event-cards-info">
                        <p className="event-cards-info-time">{event.startDate.split("T")[0]} · {"<"}{event.startDate.split("T")[1].split(".")[0]}{">"}</p>
                        <p className="event-cards-info-name">{event.name}</p>
                        <p className="event-cards-info-location">{event.Group.city}, {event.Group.state}</p>
                    </div>
                    <div className="event-cards-description">
                        <p>{event.description}</p>
                    </div>
                </div>
                </>
            )}
        </>
    )
}