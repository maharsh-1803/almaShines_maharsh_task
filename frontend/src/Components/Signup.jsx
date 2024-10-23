import { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate, Link } from 'react-router-dom'; 
import BASE_URL from "../config";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/user/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        toast.success("Signup successful! Redirecting to Short URL page...", { autoClose: 500 });
        setTimeout(() => {
          navigate('/'); 
        }, 1000);
      }  else {
        toast.error("Signup failed: " + data.message, { autoClose: 500 });
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message, { autoClose: 500 });
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-96">
        <span className="absolute top-4 right-4 cursor-pointer" onClick={() => navigate(-1)}>&times;</span>
        <h2 className="text-xl font-semibold mb-4">Signup</h2>
        <form onSubmit={handleSignup}>
          <input 
            type="text" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            placeholder="Name" 
            required 
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-sky-700"
          />
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Email" 
            required 
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-sky-700"
          />
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Password" 
            required 
            className="w-full p-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-sky-700"
          />
          <button 
            type="submit" 
            className="w-full bg-sky-700 text-white p-2 rounded hover:bg-sky-800 transition"
          >
            Signup
          </button>
        </form>
          <div className="mt-4 text-center">
            <p className="text-gray-600">Already have an account? <Link to="/login" className="text-sky-700 underline">Login here</Link></p>
          </div>
        
      </div>
    </div>
  );
};

export default Signup;
