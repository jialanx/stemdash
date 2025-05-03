import { useState } from 'react';

export default function Login() {
    const [formData, setFormData] = useState({
        student_id: '',
        user_password:''
    })

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;

        setFormData({
            ...formData,   // copy existing values
            [key]: value   // update just the changed field
        });
    }

    return (
        <>
            <h1 style={{ color: '#2B5782' }} className="p-3 mb-10 font-bold text-2xl">Log In</h1>
            <div className="mx-auto justify-center flex">
                <form className="border rounded-xl px-15 py-5 text-center">
                    {[["student_id", "Student ID"],
                    ["user_password", "Password"]].map(function ([id, label]) {
                        return (
                            <div key={id}>
                                <label className="p-5 block font-bold text-2xl">{label}</label>
                                <input className="border border-gray-400 rounded-l p-3 block bg-gray-200" 
                                type={id === "user_password" ? "password" : "text"}
                                name={id}
                                value={formData[id]}
                                onChange={handleChange}
                                placeholder={label}
                                required
                                />
                                
                            </div>
                            
                        )
                    })}
                    
                    <button className="border mt-10 p-3">Login</button>

                </form> 
            </div>
        </> 
    )
}