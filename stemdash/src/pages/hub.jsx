import { useEffect, useState } from 'react';
import { useUser } from "../UserContext";
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
     
export function Hub() {
    const { user } = useUser();
    const [data, setData] = useState([]);
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const club_id = searchParams.get("club_id");
    const [eventData, setEventData] = useState([]);
    const [eventPopupVisible, toggleEventPopupVisible] = useState(false);
    const [popupInfo, setPopupInfo] = useState('');
    const [myEvents, setMyEvents] = useState([]);


    function back() {
        navigate('/dashboard');
    }

    async function getEventInfo(event_profile) {
        setPopupInfo(event_profile);
        toggleEventPopupVisible(!eventPopupVisible);
    }

    async function getMyEvents(student_id) {
        try {
            const res = await fetch(`http://localhost:3001/listMyEvents?student_id=${student_id}&club_id=${club_id}`); 
            const data = await res.json();
            setMyEvents(data.results || []);
        } catch (err) {
            console.error("error getting events:", err);
        }
    }

    async function loadInfo(club_id) {
        try { 
            const res = await fetch(`http://localhost:3001/clubInfo?club_id=${club_id}`); 
            const data = await res.json(); 
            setData(data);

            const res2 = await fetch(`http://localhost:3001/loadEvents?club_id=${club_id}`);
            const data2 = await res2.json();
            setEventData(data2); 
        } catch (err) { 
            console.error("error fetching hub info", err); 
        } 
    }
 
    useEffect( function() {  
        if (user) { 
            loadInfo(club_id);
            getMyEvents(user.student_id);
        }}, [user]); 

    async function createTeam() {
        try {
            const res = await fetch(`http://localhost:3001/createTeam`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    event_id: popupInfo.event_id,
                    student_id: user.student_id
            })});

            const data = await res.json();
            console.log(data);
        } catch (err) {
            console.error("error creating teams", err);
        }
    }

    return (
        <>
        <button onClick={back} className="border p-2 m-10 absolute top-4 right-0">back</button>
        {data.map(function (hubContent) {
            return ( 
                <h1 className="font-bold p-2 w-10" key={hubContent.club_id}>
                    {hubContent.club_name} | member count:
                    {hubContent.member_count}
                </h1> 
            );  

        })}
        <h1 className="mt-10">events:</h1>
        {eventData.map(function (content) {
            return (
                <button key={content.event_id} onClick={function () {getEventInfo(content)}} className="border m-2 p-1">{content.event_name}</button>
            ); 
        })}
        <h2>My Teams</h2>
        {myEvents.length === 0 ? (
            <p>You are not on any teams.</p>
        ) : (
            myEvents.map(function (event) {
                return(
                <h3 key={`${event.event_id}-${event.team_id}`}>{event.event_name} - team: {event.team_id}</h3>
            );
        }))}
        {(user.student_id == 0) && (
            <button className="border m-2 p-1">Create Event</button>
        )}
                { eventPopupVisible && (
                    <>
                    <h1 className="mt-5">{popupInfo.event_name}</h1> 
                    <button onClick={createTeam} className="border m-2 p-1">create Team</button>
                    <button className="border m-2 p-1">join Team</button>
                </>         
                )} 
            </>
    )}
                         