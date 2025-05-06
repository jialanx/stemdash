import { useEffect, useState } from 'react';
import { useUser } from "../UserContext";
import { Navigate, useNavigate } from 'react-router-dom';


export default function Dashboard() {
    const { user } = useUser();
    const [hubs, setHubs] = useState([]);
    const navigate = useNavigate();
    const [createEventVisible, setEventVisible] = useState(false);
    const [formData, setFormData] = useState('');

    if (!user) {
        navigate("/");
    } 
    
    function createHub() {
        console.log("creating hub");
        setEventVisible(!createEventVisible);
        console.log(createEventVisible);
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

    function handleChange(event) {
        setFormData(event.target.value);
    }

    async function createClub(e) {
        e.preventDefault();
        console.log("club:", formData);
        
        try {
            const res = await fetch("http://localhost:3001/createNewClub", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({club_name: formData})
              });
        
              const data = await res.json();
              console.log(data);
              if (res.ok) {
                setFormData('');
              }
              
        } catch (err) {
            console.error("error fetching hubs", err);
        }
    }

    return (
        <>
        
        {hubs.map(function (hubContent) {
            return ( 
                <button onClick={function () {submit(hubContent.club_id)}} className="m-2 border p-2" key={hubContent.club_id}>
                    {hubContent.club_name}
                </button>
            );
        })}

        <button onClick={createHub} className="m-2 border p-2">Create New Hub</button>

        {createEventVisible && ( // if statement
        <>
            <div className="flex justify-center items-center">
                <div className="bg-red-500 w-60 h-40 border rounded-xl">
                <form onSubmit={createClub}>
                    <input 
                    className="border border-gray-400 rounded-l p-3 block bg-gray-200 w-80"
                    type="text"
                    value={formData}
                    onChange={handleChange}
                    placeholder="Create new hub"
                    required />
                </form>
                </div>
            </div>
        </> 
        )} 
        </>
    );
}