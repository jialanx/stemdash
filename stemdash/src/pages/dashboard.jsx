import { useEffect, useState } from 'react';
import { useUser } from "../UserContext";
import { Navigate, useNavigate } from 'react-router-dom';


export default function Dashboard() {
    const { user } = useUser();
    const [hubs, setHubs] = useState([]);
    const navigate = useNavigate();


    if (!user) {
        navigate("/");
    }
 
    function submit (club_id) {
        navigate("/hub?club_id=" + club_id);
    }

    async function loadHubs(id) {
        try {
            const res = await fetch(`http://localhost:3001/hubs?student_id=${id}`)
            const data = await res.json();
            setHubs(data);
        } catch (err) {
            console.error("error fetching hubs", err);
        }
    }

    useEffect( function () {
        if (user) {
            loadHubs(user.student_id);
        }}, [user]); 
    
    return (
        <>
        
        {hubs.map(function (hubContent) {
            return ( 
                <button onClick={function () {submit(hubContent.club_id)}} className="m-2 border p-2" key={hubContent.club_id}>
                    {hubContent.club_name}
                </button>
            );
        })}
        </>
    );
}