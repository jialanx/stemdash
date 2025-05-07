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
 
    function back() {
        navigate('/dashboard');
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
        }}, [user]); 

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
                <button className="border m-2 p-1">{content.event_name}</button>
            ); 
        })}
        </>
    )}
                  