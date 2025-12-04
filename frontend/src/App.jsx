import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar/Navbar';
import { Home } from './pages/Home/Home';
import { About } from './pages/About/About';
import { NotFound } from './pages/NotFound/NotFound';
import './styles/App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navbar />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
