import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import BASE_URL from "../config";
import Login from './Login'; 
import Signup from './Signup'; 

const ShortUrl = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [myUrls, setMyUrls] = useState([]);
  const [expirationTime, setExpirationTime] = useState("1minute");
  
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    localStorage.removeItem('myUrls'); 
    setMyUrls([]); 
  }, []);

  const handleCopy = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl);
      toast.success("Short URL copied to clipboard!", { autoClose: 2000 });
    } else {
      toast.error("No Short URL available to copy!", { autoClose: 2000 });
    }
  };

  const handleLongUrlChange = (e) => {
    setLongUrl(e.target.value);
  };

  const handleExpirationChange = (e) => {
    setExpirationTime(e.target.value);
  };

  const handleShortenUrl = async () => {
    if (longUrl) {
      try {
        let expirationDate = new Date();
        
        switch (expirationTime) {
          case "1minute":
            expirationDate.setMinutes(expirationDate.getMinutes() + 1);
            break;
          case "1hour":
            expirationDate.setHours(expirationDate.getHours() + 1);
            break;
          case "1day":
            expirationDate.setDate(expirationDate.getDate() + 1);
            break;
          case "7days":
            expirationDate.setDate(expirationDate.getDate() + 7);
            break;
          case "15days":
            expirationDate.setDate(expirationDate.getDate() + 15);
            break;
          default:
            break;
        }

        const response = await fetch(`${BASE_URL}/shorten`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            longUrl: longUrl,
            expirationDate: expirationDate.toISOString(),
          }),
        });

        const data = await response.json();
        if (response.ok) {
          setShortUrl(data.shortUrl);
          setQrCodeUrl(data.qrCodeUrl);

          const newUrls = [...myUrls, data.shortUrl];
          setMyUrls(newUrls);
          localStorage.setItem('myUrls', JSON.stringify(newUrls));

          toast.success("Short URL created successfully!", { autoClose: 500 });
        } else {
          toast.error("Error shortening URL: " + data.message, { autoClose: 500 });
        }
      } catch (error) {
        toast.error("An error occurred while shortening the URL: " + error.message, { autoClose: 500 });
      }
    } else {
      toast.error("Please enter a valid Long URL!", { autoClose: 500 });
    }
  };

  const handleDownloadQRCode = () => {
    const token = localStorage.getItem('token'); 
    if (token) {
      if (qrCodeUrl) {
        const link = document.createElement("a");
        link.href = qrCodeUrl;
        link.download = "qr_code.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("QR Code downloaded!", { autoClose: 500 });
      } else {
        toast.error("No QR Code available to download!", { autoClose: 500 });
      }
    } else {
      setShowLogin(true); 
    }
  };


  return (
    <div className="max-w-md mx-auto mt-[10vh] bg-gray-50 shadow-md rounded-lg p-6 relative">
      <ToastContainer />
      <h2 className="text-lg font-semibold mb-4">Your Long URL</h2>
      <input
        type="text"
        placeholder="Enter your long URL here"
        value={longUrl}
        onChange={handleLongUrlChange}
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />
      
      <h2 className="text-lg font-semibold mb-4">Expiration Time</h2>
      <select 
        value={expirationTime} 
        onChange={handleExpirationChange} 
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      >
        <option value="1minute">1 Minute</option>
        <option value="1hour">1 Hour</option>
        <option value="1day">1 Day</option>
        <option value="7days">7 Days</option>
        <option value="15days">15 Days</option>
      </select>

      <h2 className="text-lg font-semibold mb-4">Short URL</h2>
      <input
        type="text"
        value={shortUrl}
        readOnly
        placeholder="Your shortened URL will appear here"
        className="w-full p-2 mb-4 border border-gray-300 rounded-lg"
      />

      <div className="flex space-x-2 mb-4">
        <button
          className="bg-sky-700 text-white p-2 rounded-lg relative"
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          onClick={handleDownloadQRCode}
        >
          QR Code
          {isHovering && qrCodeUrl && (
            <div className="absolute w-48 h-48 top-10 left-0 bg-white shadow-md p-2 rounded-md z-10">
              <img src={qrCodeUrl} alt="QR Code" className="w-full h-full" />
            </div>
          )}
        </button>
        <button
          className="bg-sky-700 text-white p-2 rounded-lg"
          onClick={handleCopy}
        >
          Copy
        </button>
        <button
          className="bg-sky-700 text-white p-2 rounded-lg"
          onClick={handleShortenUrl}
        >
          Shorten another
        </button>
      </div>

        

      {myUrls.length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Recent URLs:</h3>
          <ul className="list-disc ml-6">
            {myUrls.map((url, index) => (
              <li key={index} className="text-blue-600">
                <a href={url} target="_blank" rel="noopener noreferrer">
                  {url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showLogin && <Login onClose={() => setShowLogin(false)} />}
      {showSignup && <Signup onClose={() => setShowSignup(false)} />}
    </div>
  );
};

export default ShortUrl;
