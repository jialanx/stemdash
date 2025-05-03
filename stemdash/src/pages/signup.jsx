import { useState } from 'react';

export default function Signup() {
    const [formData, setFormData] = useState({
        student_id: "",
        first_name: "",
        last_name: "",
        preferred_name: "",
        student_email: "",
        phone_number: "",
        student_gender: "",
        student_pronouns: "",
        student_grade: "",
        shirt_size: "",
        user_password: "",
    })
    const [message, setMessage] = useState("");

    function handleChange(e) {
        const key = e.target.name;
        const value = e.target.value;

        setFormData({
            ...formData,
            [key]: value
        });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            const res = await fetch("http://localhost:3001/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data != null) {
                setMessage("Signed up successfully!");
                setFormData({
                    student_id: "",
                    first_name: "",
                    last_name: "",
                    preferred_name: "",
                    student_email: "",
                    phone_number: "",
                    student_gender: "",
                    student_pronouns: "",
                    student_grade: "",
                    shirt_size: "",
                    user_password: ""
                });
            } else {
                setMessage("Signup failed.");
            }
        } catch (err) {
            console.error(err);
            setMessage("Server error. Try again.");
        }
    }

    return (
        <>
            <h1 style={{ color: '#2B5782' }} className="p-3 mb-10 font-bold text-2xl">Sign Up</h1>
            <div className="mx-auto justify-center flex">
                <form onSubmit={handleSubmit} className="border rounded-xl px-20 py-5 text-center"> {[
                    ["student_id", "Student ID"],
                    ["first_name", "First Name"],
                    ["last_name", "Last Name"],
                    ["preferred_name", "Preferred Name"],
                    ["student_email", "Student Email"],
                    ["phone_number", "Phone Number"],
                    ["student_gender", "Gender"],
                    ["student_pronouns", "Pronouns"],
                    ["student_grade", "Grade"],
                    ["shirt_size", "Shirt Size"],
                    ["user_password", "User Password"]
                ].map(function ([id, label]) {
                    return (
                        <div key={id}>
                            <label className="p-5 block font-bold text-2xl">{label}</label>
                            <input
                                className="border border-gray-400 rounded-l p-3 block bg-gray-200 w-80"
                                type={id === "user_password" ? "password" : "text"}
                                name={id}
                                value={formData[id]}
                                onChange={handleChange}
                                placeholder={label}
                                required
                            />
                        </div>
                    );
                })}
                    <button type="submit" className="border mt-10 p-3">Submit</button>
                    <p className="mt-5 text-green-600 font-semibold">{message}</p>
                </form>
            </div>
        </>
    );
} 
