import { useState, useContext } from 'react';
import { UserContext } from "../UserContext";
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [formData, setFormData] = useState({
    student_id: '',
    user_password: ''
  });

  const [message, setMessage] = useState('');
  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  // when you submit your login information it will run this
  async function submit(e) {
    e.preventDefault(); // prevents page from reloading

    try { 
      const res = await fetch("http://localhost:3001/login", { // calls the login command in server/index.js
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json(); 
      setFormData({ student_id: '', user_password: '' }); // clears form

      if (data.success) {
        setMessage("Login successful!");
        setUser(data.user);
        navigate('/dashboard'); 
      } else {
        setMessage("Login failed: " + data.message);
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error.");
    }
  }

  // when you type in text box it will update all the values.
  function handleChange(event) {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    const updatedFormData = { ...formData };
    updatedFormData[inputName] = inputValue;
    setFormData(updatedFormData);
}

  return (
    <>
      <h1 style={{ color: '#2B5782' }} className="p-3 mb-10 font-bold text-2xl">Log In</h1>
      <div className="mx-auto justify-center flex">
        <form onSubmit={submit} className="border rounded-xl px-12 py-5 text-center">
          {[
            ["student_id", "Student ID"],
            ["user_password", "Password"]
          ].map(([id, label]) => ( // for each item in this array, it will run the following lines
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
          ))}

          <button type="submit" className="border mt-10 p-3">Login</button>
          {message && <p className="mt-5 text-red-500">{message}</p>}
        </form>
      </div>
    </>
  );
}
