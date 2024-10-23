import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom'; 
import BASE_URL from "../config";

const Login = ({ onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      toast.info("You are already logged in."); 
      onClose(); 
    }
  }, [onClose]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${BASE_URL}/api/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token); 
        toast.success("Login successful", { autoClose: 500 });
        
        setTimeout(() => {
          onClose(); 
          navigate('/'); 
        }, 1000);
      } else {
        toast.error("Login failed: " + data.message, { autoClose: 500 });
      }
    } catch (error) {
      toast.error("An error occurred: " + error.message, { autoClose: 500 });
    }
  };

  const handleSignupRedirect = () => {
    navigate('/signup'); 
    onClose(); 
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 relative w-96">
        <span className="absolute top-4 right-4 cursor-pointer" onClick={onClose}>&times;</span>
        <h2 className="text-xl font-semibold mb-4">Login</h2>
        <form onSubmit={handleLogin}>
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
            Login
          </button>
        </form>
        <div className="mt-4 text-center">
          <p className="text-sm">Dont have an account?</p>
          <button 
            onClick={handleSignupRedirect} 
            className="text-sky-700 hover:underline"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
