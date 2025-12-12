import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './pages/Home/Home';
import { About } from './pages/About/About';
import { Login } from "./pages/Login/Login";
import { Register } from './pages/Register/Register';
import { Chat } from './pages/Chat/Chat';
import { NotFound } from './pages/NotFound/NotFound';
import { ChallengeCard } from './components/Challenges/ChallengeCard';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-base-100">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/chat" element={<Chat />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/test-challenge"
              element={<ChallengeCard testId={6} />}/>
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
