import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Signup from './Signup';
import Login from './Login'; 
import Upload from './Upload';
import Home from './Home';
import Following from './Following';
import Trending from './Trending';


function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} /> 
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/home" element={<Home />} /> 
          <Route path="/trending" element={<Trending />} /> 
          <Route path="/following" element={<Following />} /> 
          
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
