import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Components/Login';
import Signup from './Components/Signup'; // Import your Signup component
import ShortUrl from './Components/ShortUrl';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path='/' element={<ShortUrl/>}/>
      </Routes>
    </Router>
  );
};

export default App;
